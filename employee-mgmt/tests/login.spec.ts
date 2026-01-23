import { test, expect, Page } from '@playwright/test';

// Test data
const testUsers = {
    admin: {
        email: 'admin@gmail.com',
        password: 'Admin@123',
    },
    user: {
        email: 'devisha@mailinator.com',
        password: 'Devisha@123',
    },
    invalid: {
        email: 'wrong@example.com',
        password: 'wrongpass',
    },
};

// Helper functions
async function fillLoginForm(page: Page, identifier: string, password: string) {
    await page.fill('input[name="usernameOrEmail"]', identifier);
    await page.fill('input[name="password"]', password);
}

async function submitLoginForm(page: Page) {
    await page.click('button[type="submit"]');
}

test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should display login form with all elements', async ({ page }) => {
        // Check page title
        await expect(page.locator('text=Welcome back')).toBeVisible();
        await expect(page.locator('text=Sign in to manage your team')).toBeVisible();

        // Check form elements
        await expect(page.locator('input[name="usernameOrEmail"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.locator('text=Remember me')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();

        // Check Google login button
        await expect(page.locator('text=Don\'t have an account?')).toBeVisible();
        await expect(page.locator('text=Register')).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
        await submitLoginForm(page);

        await expect(page.locator('text=Email or Username is required.')).toBeVisible();
        await expect(page.locator('text=Password is required.')).toBeVisible();
    });

    test('should show validation error for short password', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, '12345');
        await submitLoginForm(page);

        await expect(
            page.locator('text=Password must be at least 6 characters long.')
        ).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({ page }) => {
        await fillLoginForm(page, 'invalidemail@', testUsers.admin.password);
        await submitLoginForm(page);

        await expect(
            page.locator('text=Please enter a valid email address.')
        ).toBeVisible();
    });

    test('should clear validation errors when user starts typing', async ({ page }) => {
        // Trigger validation errors
        await submitLoginForm(page);
        await expect(page.locator('text=Email or Username is required.')).toBeVisible();

        // Start typing
        await page.fill('input[name="usernameOrEmail"]', 'a');
        await expect(page.locator('text=Email or Username is required.')).not.toBeVisible();
    });

    test('should successfully login with email', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);

        // Wait for navigation
        await page.waitForURL('http://localhost:5173/auth/2fa');
        expect(page.url()).toContain('/auth/2fa');
    });

    test('should redirect user role to correct dashboard', async ({ page }) => {
        await fillLoginForm(page, testUsers.user.email, testUsers.user.password);
        await submitLoginForm(page);

        await page.waitForURL('http://localhost:5173/user/dashboard', { timeout: 60000 });  // 60 seconds
        expect(page.url()).toContain('/user/dashboard');
    });

    test('should show error message for invalid credentials', async ({ page }) => {
        await fillLoginForm(page, testUsers.invalid.email, testUsers.invalid.password);
        await submitLoginForm(page);

        await expect(page.locator('.MuiAlert-root')).toBeVisible();
        await expect(page.locator('.MuiAlert-root')).toContainText(/invalid|incorrect|wrong/i);
    });

    test('handles remember me checkbox', async ({ page }) => {
        // Locate the "Remember me" checkbox using its role and name
        const checkbox = page.getByRole('checkbox', { name: 'Remember me' });

        // Initially unchecked
        await expect(checkbox).not.toBeChecked(); // This ensures it's not checked initially

        // Check the checkbox
        await checkbox.check(); // Now the checkbox should be checked

        // Assert that the checkbox is now checked
        await expect(checkbox).toBeChecked();
    });

    test('should navigate to register page', async ({ page }) => {
        await page.click('text=Register');
        await page.waitForURL('http://localhost:5173/register');
        expect(page.url()).toContain('/register');
    });

    test('should show loading state during login', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Check loading state
        await expect(submitButton).toBeDisabled();
        await expect(submitButton).toContainText('Signing in...');
    });

});

test.describe('Two-Factor Authentication Setup', () => {
    test.beforeEach(async ({ page }) => {
        // Mock login that requires 2FA setup
        await page.goto('http://localhost:5173/login');
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);
        await page.waitForURL('http://localhost:5173/auth/2fa-setup');
    });

    test('should display 2FA setup page with QR code', async ({ page }) => {
        await expect(page.locator('text=Set up Two-Factor Authentication')).toBeVisible();
        await expect(
            page.locator('text=Scan the QR code using Google Authenticator')
        ).toBeVisible();

        // Check QR code is rendered
        await expect(page.locator('svg')).toBeVisible();

        // Check manual entry key is displayed
        await expect(page.locator('text=Can\'t scan? Enter this key manually:')).toBeVisible();
    });

    test('should redirect to login if no temp token', async ({ page }) => {
        // Clear temp token
        await page.evaluate(() => {
            localStorage.removeItem('temp_token');
        });

        await page.reload();
        await page.waitForURL('http://localhost:5173/login');
        expect(page.url()).toContain('/login');
    });

    test('should only accept numeric input for code', async ({ page }) => {
        const codeInput = page.locator('input[inputMode="numeric"]');

        await codeInput.fill('abc123xyz');
        await expect(codeInput).toHaveValue('123');
    });

    test('should limit code input to 6 digits', async ({ page }) => {
        const codeInput = page.locator('input[inputMode="numeric"]');

        await codeInput.fill('1234567890');
        await expect(codeInput).toHaveValue('123456');
    });

    test('should disable verify button when code is incomplete', async ({ page }) => {
        const verifyButton = page.locator('button:has-text("Verify & Enable")');

        await expect(verifyButton).toBeDisabled();

        const codeInput = page.locator('input[inputMode="numeric"]');
        await codeInput.fill('12345');
        await expect(verifyButton).toBeDisabled();

        await codeInput.fill('123456');
        await expect(verifyButton).not.toBeDisabled();
    });

    test('should successfully verify and enable 2FA', async ({ page }) => {
        const codeInput = page.locator('input[inputMode="numeric"]');
        await codeInput.fill('123456'); // Use valid TOTP code in actual tests

        await page.click('button:has-text("Verify & Enable")');

        // Should redirect to home after successful verification
        await page.waitForURL('http://localhost:5173/');
        expect(page.url()).not.toContain('/auth/2fa-setup');
    });

    test('should show error for invalid 2FA code', async ({ page }) => {
        const codeInput = page.locator('input[inputMode="numeric"]');
        await codeInput.fill('000000');

        await page.click('button:has-text("Verify & Enable")');

        await expect(page.locator('.MuiAlert-root')).toBeVisible();
    });
});

test.describe('Two-Factor Authentication Verification', () => {
    test.beforeEach(async ({ page }) => {
        // Go to login page
        await page.goto('http://localhost:5173/login');

        // Fill login form and submit
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);

        // Wait for the response or the 2FA page URL
        await page.waitForResponse(response => response.url().includes('/auth/2fa-setup') && response.status() === 200);

        // Alternatively, wait for the QR code to appear
        await page.waitForSelector('.qr-code'); // Replace with the actual selector for the QR code

        expect(page.url()).toContain('/auth/2fa-setup');
    });

    test('should display 2FA verification page', async ({ page }) => {
        await expect(page.locator('text=Two-Factor Authentication')).toBeVisible();
        await expect(
            page.locator('text=Enter the 6-digit code from Google Authenticator')
        ).toBeVisible();
    });

    test('should only accept 6-digit numeric code', async ({ page }) => {
        const codeInput = page.locator('input[inputMode="numeric"]');

        await codeInput.fill('abc123def456');
        await expect(codeInput).toHaveValue('123456');
    });

    test('should disable verify button with incomplete code', async ({ page }) => {
        const verifyButton = page.locator('button:has-text("Verify")');
        await expect(verifyButton).toBeDisabled();

        const codeInput = page.locator('input[inputMode="numeric"]');
        await codeInput.fill('12345');
        await expect(verifyButton).toBeDisabled();

        await codeInput.fill('123456');
        await expect(verifyButton).not.toBeDisabled();
    });

    test('should successfully verify 2FA and login', async ({ page }) => {
        const codeInput = page.locator('input[inputMode="numeric"]');
        await codeInput.fill('123456'); // Use valid TOTP code

        await page.click('button:has-text("Verify")');

        await page.waitForURL('/');
        expect(page.url()).not.toContain('http://localhost:5173/auth/2fa');
    });

    test('should show error for incorrect 2FA code', async ({ page }) => {
        const codeInput = page.locator('input[inputMode="numeric"]');
        await codeInput.fill('999999');

        await page.click('button:has-text("Verify")');

        await expect(page.locator('.MuiAlert-root')).toBeVisible();
    });
});

test.describe('Google OAuth Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should display Google login button', async ({ page }) => {
        // Google OAuth button is rendered by @react-oauth/google
        const googleButton = page.locator('iframe[title*="Google"]');
        await expect(googleButton).toBeVisible();
    });

    test('should handle successful Google login', async ({ page, context }) => {
        // Mock successful Google OAuth response
        await page.route('**/v1/messages', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    token: 'mock-google-jwt-token',
                    role: 'user',
                }),
            });
        });

        // Trigger Google login (implementation depends on test environment)
        // This is a placeholder - actual implementation requires OAuth mocking
    });
});

test.describe('Session Management', () => {
    test('should store token in localStorage on successful login', async ({ page }) => {
        await page.goto('http://localhost:5173/login');
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);

        await page.waitForURL('http://localhost:5173/admin/employees');

        const token = await page.evaluate(() => localStorage.getItem('access_token'));
        expect(token).toBeTruthy();
    });

    test('should clear token on logout', async ({ page }) => {
        // First login
        await page.goto('http://localhost:5173/login');
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);
        await page.waitForURL('http://localhost:5173/admin/employees');

        // Then logout
        await page.click('text=Logout'); // Adjust selector based on your UI

        const token = await page.evaluate(() => localStorage.getItem('access_token'));
        expect(token).toBeNull();
    });

    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
        await page.goto('/admin/employees');
        await page.waitForURL('http://localhost:5173/login');
        expect(page.url()).toContain('/login');
    });
});

test.describe('Accessibility', () => {
    test('login form should be keyboard navigable', async ({ page }) => {
        await page.goto('/login');

        await page.keyboard.press('Tab');
        await expect(page.locator('input[name="usernameOrEmail"]')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(page.locator('input[name="password"]')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(page.locator('input[type="checkbox"]')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(page.locator('button[type="submit"]')).toBeFocused();
    });

    test('should submit form with Enter key', async ({ page }) => {
        await page.goto('/login');
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);

        await page.keyboard.press('Enter');

        await page.waitForURL('http://localhost:5173/admin/employees');
        expect(page.url()).toContain('/admin/employees');
    });
});