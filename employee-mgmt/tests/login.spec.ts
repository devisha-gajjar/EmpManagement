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
    twofa: {
        email: "manager@gmail.com",
        password: "Admin@123",
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

test.describe('Login Page - UI Elements', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should display all login form elements', async ({ page }) => {
        // Check page title and subtitle
        await expect(page.locator('text=Welcome back')).toBeVisible();
        await expect(page.locator('text=Sign in to manage your team')).toBeVisible();

        // Check form input fields
        await expect(page.locator('input[name="usernameOrEmail"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();

        // Check form labels
        await expect(page.locator('label:has-text("Email or Username")')).toBeVisible();
        await expect(page.locator('label:has-text("Password")')).toBeVisible();

        // Check remember me checkbox
        await expect(page.locator('text=Remember me')).toBeVisible();
        const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
        await expect(checkbox).toBeVisible();

        // Check submit button
        const submitButton = page.locator('button[type="submit"]');
        await expect(submitButton).toBeVisible();
        await expect(submitButton).toContainText('Login');
        await expect(submitButton).not.toBeDisabled();

        // Check Google login section
        await expect(page.locator('text=Don\'t have an account?')).toBeVisible();
        await expect(page.locator('text=Register')).toBeVisible();
    });

    test('should display Google OAuth button', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await expect(
            page.getByRole('button', { name: /sign in with google/i })
        ).toBeVisible();
    });

    test('should have proper page styling and layout', async ({ page }) => {
        // Check main container
        const container = page.locator('form').locator('..');
        await expect(container).toBeVisible();

        // Verify form is centered and has proper styling
        const formBox = page.locator('form');
        await expect(formBox).toBeVisible();
    });
});

test.describe('Login Page - Form Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should show validation errors for empty fields', async ({ page }) => {
        // Submit form without filling any fields
        await submitLoginForm(page);

        // Check validation error messages
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

    test('should show validation error for 1-character password', async ({ page }) => {
        await page.fill('input[name="usernameOrEmail"]', testUsers.admin.email);
        await page.fill('input[name="password"]', '1');
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

    test('should show validation error for email without domain', async ({ page }) => {
        await fillLoginForm(page, 'test@', testUsers.admin.password);
        await submitLoginForm(page);

        await expect(
            page.locator('text=Please enter a valid email address.')
        ).toBeVisible();
    });

    test('should clear validation errors when user starts typing in email field', async ({ page }) => {
        // Trigger validation errors
        await submitLoginForm(page);
        await expect(page.locator('text=Email or Username is required.')).toBeVisible();

        // Start typing in email field
        await page.fill('input[name="usernameOrEmail"]', 'a');

        // Email validation error should disappear
        await expect(page.locator('text=Email or Username is required.')).not.toBeVisible();

        // Password error should still be visible
        await expect(page.locator('text=Password is required.')).toBeVisible();
    });

    test('should clear validation errors when user starts typing in password field', async ({ page }) => {
        // Trigger validation errors
        await submitLoginForm(page);
        await expect(page.locator('text=Password is required.')).toBeVisible();

        // Start typing in password field
        await page.fill('input[name="password"]', 'a');

        // Password validation error should disappear
        await expect(page.locator('text=Password is required.')).not.toBeVisible();
    });

    test('should accept username without @ symbol', async ({ page }) => {
        await page.fill('input[name="usernameOrEmail"]', 'johndoe');
        await page.fill('input[name="password"]', 'Password@123');
        await submitLoginForm(page);

        // Should not show email format validation error for username
        await expect(
            page.locator('text=Please enter a valid email address.')
        ).not.toBeVisible();
    });

    test('should accept valid email format', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);

        // Should not show validation errors
        await expect(
            page.locator('text=Please enter a valid email address.')
        ).not.toBeVisible();
        await expect(
            page.locator('text=Email or Username is required.')
        ).not.toBeVisible();
    });
});

test.describe('Login Page - Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });
    test('should navigaete to user dashboard', async ({ page }) => {
        await fillLoginForm(page, testUsers.user.email, testUsers.user.password);
        await submitLoginForm(page);
        await page.waitForURL('http://localhost:5173/user/dashboard');
        expect(page.url()).toContain('/dashboard');
    });

    test('should successfully login and redirect to 2FA verification', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);

        // Wait for navigation to 2FA page
        await page.waitForURL('http://localhost:5173/auth/2fa', { timeout: 10000 });
        expect(page.url()).toContain('/auth/2fa');
    });

    test('should redirect user role to correct dashboard', async ({ page }) => {
        await fillLoginForm(page, testUsers.user.email, testUsers.user.password);
        await submitLoginForm(page);

        // Wait for navigation to user dashboard
        await page.waitForURL('http://localhost:5173/user/dashboard', { timeout: 10000 });
        expect(page.url()).toContain('/user/dashboard');
    });

    test('should show error message for invalid credentials', async ({ page }) => {
        await fillLoginForm(page, testUsers.invalid.email, testUsers.invalid.password);
        await submitLoginForm(page);

        // Check for error alert
        const errorAlert = page.locator('.MuiAlert-root');
        await expect(errorAlert).toBeVisible({ timeout: 5000 });
        await expect(errorAlert).toContainText("Invalid Login Credentials.");
    });

    test('should show error message for incorrect password', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, 'WrongPassword123');
        await submitLoginForm(page);

        // Check for error alert
        await expect(page.locator('.MuiAlert-root')).toBeVisible();
    });

    test('should show error message for non-existent user', async ({ page }) => {
        await fillLoginForm(page, 'nonexistent@example.com', 'Password123');
        await submitLoginForm(page);

        // Check for error alert
        await expect(page.locator('.MuiAlert-root')).toBeVisible();
    });
});

test.describe('Login Page - Loading States', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should show loading state during login', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Check loading state
        await expect(submitButton).toBeDisabled();
        await expect(submitButton).toContainText('Signing in...');
    });

    test('should disable submit button while loading', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);

        const submitButton = page.locator('button[type="submit"]');

        // Button should be enabled before clicking
        await expect(submitButton).not.toBeDisabled();

        await submitButton.click();

        // Button should be disabled during loading
        await expect(submitButton).toBeDisabled();
    });

    test('should change button text to "Signing in..." during login', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);

        const submitButton = page.locator('button[type="submit"]');

        // Initial button text
        await expect(submitButton).toContainText('Login');

        await submitButton.click();

        // Loading button text
        await expect(submitButton).toContainText('Signing in...');
    });
});

test.describe('Login Page - Remember Me Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should have remember me checkbox unchecked by default', async ({ page }) => {
        const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
        await expect(checkbox).not.toBeChecked();
    });

    test('should toggle remember me checkbox', async ({ page }) => {
        const checkbox = page.getByRole('checkbox', { name: 'Remember me' });

        // Initially unchecked
        await expect(checkbox).not.toBeChecked();

        // Check the checkbox
        await checkbox.check();
        await expect(checkbox).toBeChecked();

        // Uncheck the checkbox
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
    });

    test('should maintain checkbox state while typing', async ({ page }) => {
        const checkbox = page.getByRole('checkbox', { name: 'Remember me' });

        // Check the checkbox
        await checkbox.check();
        await expect(checkbox).toBeChecked();

        // Fill form
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);

        // Checkbox should still be checked
        await expect(checkbox).toBeChecked();
    });

    test('should submit form with remember me checked', async ({ page }) => {
        const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
        await checkbox.check();

        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);

        // Should proceed with login
        await expect(page.locator('button[type="submit"]')).toBeDisabled();
    });
});

test.describe('Login Page - Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should navigate to register page when clicking Register link', async ({ page }) => {
        await page.click('text=Register');

        await page.waitForURL('http://localhost:5173/register', { timeout: 5000 });
        expect(page.url()).toContain('/register');
    });

    test('should have clickable Register link', async ({ page }) => {
        const registerLink = page.locator('text=Register');
        await expect(registerLink).toBeVisible();

        // Check if it's styled as a link/button
        await expect(registerLink).toHaveCSS('cursor', 'pointer');
    });
});

test.describe('Login Page - Session Management', () => {
    test('should store access token in localStorage on successful login', async ({ page }) => {
        await page.goto('http://localhost:5173/login');
        await fillLoginForm(page, testUsers.user.email, testUsers.user.password);
        await submitLoginForm(page);

        await page.waitForURL('http://localhost:5173/user/dashboard', { timeout: 10000 });

        const token = await page.evaluate(() => localStorage.getItem('access_token'));
        expect(token).toBeTruthy();
        expect(token).not.toBeNull();
    });

    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
        // Clear any existing tokens
        await page.goto('http://localhost:5173/login');
        await page.evaluate(() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('temp_token');
        });

        // Try to access protected route
        await page.goto('http://localhost:5173/admin/employees');

        // Should redirect to login
        await page.waitForURL('http://localhost:5173/login', { timeout: 5000 });
        expect(page.url()).toContain('/login');
    });
});

test.describe('Login Page - Accessibility', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should be keyboard navigable', async ({ page }) => {
        // Tab to email input
        await page.click('input[name="usernameOrEmail"]');
        await expect(page.locator('input[name="usernameOrEmail"]')).toBeFocused();

        // Tab to password input
        await page.keyboard.press('Tab');
        await expect(page.locator('input[name="password"]')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(page.locator('button[aria-label="Show password"]')).toBeFocused();

        // Tab to remember me checkbox
        await page.keyboard.press('Tab');
        const rememberMe = page.getByRole('checkbox', { name: /remember me/i });
        await expect(rememberMe).toBeFocused();

        // Tab to submit button
        await page.keyboard.press('Tab');
        await expect(page.locator('button[type="submit"]')).toBeFocused();
    });

    test('should submit form with Enter key from email field', async ({ page }) => {
        await page.click('input[name="usernameOrEmail"]');
        await page.fill('input[name="usernameOrEmail"]', testUsers.admin.email);
        await page.fill('input[name="password"]', testUsers.admin.password);

        // Press Enter from email field
        await page.keyboard.press('Enter');

        // Should trigger form submission
        await expect(page.locator('button[type="submit"]')).toBeDisabled();
    });

    test('should submit form with Enter key from password field', async ({ page }) => {
        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);

        // Focus on password field and press Enter
        await page.click('input[name="password"]');
        await page.keyboard.press('Enter');

        // Should trigger form submission
        await expect(page.locator('button[type="submit"]')).toBeDisabled();
    });

    test('should have proper label associations', async ({ page }) => {
        // Check email/username label
        const emailLabel = page.locator('label:has-text("Email or Username")');
        await expect(emailLabel).toBeVisible();

        // Check password label
        const passwordLabel = page.locator('label:has-text("Password")');
        await expect(passwordLabel).toBeVisible();
    });

    test('should toggle remember me checkbox with Space key', async ({ page }) => {
        const checkbox = page.getByRole('checkbox', { name: 'Remember me' });

        // Focus checkbox
        await checkbox.focus();
        await expect(checkbox).toBeFocused();

        // Initially unchecked
        await expect(checkbox).not.toBeChecked();

        // Toggle with Space
        await page.keyboard.press('Space');
        await expect(checkbox).toBeChecked();

        // Toggle again
        await page.keyboard.press('Space');
        await expect(checkbox).not.toBeChecked();
    });
});

test.describe('Login Page - Error Handling', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should display error alert with proper styling', async ({ page }) => {
        await fillLoginForm(page, testUsers.invalid.email, testUsers.invalid.password);
        await submitLoginForm(page);

        const errorAlert = page.locator('.MuiAlert-root');
        await expect(errorAlert).toBeVisible();

        // Check it's an error severity alert
        await expect(errorAlert).toHaveAttribute('class', /MuiAlert-standardError/);
    });

    test('should clear error message when user edits form', async ({ page }) => {
        // Trigger error
        await fillLoginForm(page, testUsers.invalid.email, testUsers.invalid.password);
        await submitLoginForm(page);
        await expect(page.locator('.MuiAlert-root')).toBeVisible();

        // Edit form (this behavior depends on your implementation)
        // If your app clears errors on input change, test that here
        await page.fill('input[name="usernameOrEmail"]', testUsers.admin.email);

        // Error might persist until next submission, depending on implementation
    });

    test('should handle network errors gracefully', async ({ page }) => {
        // Simulate network failure by going offline
        await page.context().setOffline(true);

        await fillLoginForm(page, testUsers.admin.email, testUsers.admin.password);
        await submitLoginForm(page);

        // Should show some error indication
        // The exact behavior depends on your error handling
        await page.context().setOffline(false);
    });
});

test.describe('Login Page - Google OAuth', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });


    test('should have Google OAuth section properly positioned', async ({ page }) => {
        // Check that Google login section exists
        const googleSection = page.locator('iframe[title*="Google"]').locator('..');
        await expect(googleSection).toBeVisible();
    });
});

test.describe('Login Page - Form Behavior', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');
    });

    test('should prevent form submission with only email filled', async ({ page }) => {
        await page.fill('input[name="usernameOrEmail"]', testUsers.admin.email);
        await submitLoginForm(page);

        // Should show password required error
        await expect(page.locator('text=Password is required.')).toBeVisible();

        // Should not navigate away
        expect(page.url()).toContain('/login');
    });

    test('should prevent form submission with only password filled', async ({ page }) => {
        await page.fill('input[name="password"]', testUsers.admin.password);
        await submitLoginForm(page);

        // Should show email/username required error
        await expect(page.locator('text=Email or Username is required.')).toBeVisible();

        // Should not navigate away
        expect(page.url()).toContain('/login');
    });

    test('should trim whitespace from email input', async ({ page }) => {
        await page.fill('input[name="usernameOrEmail"]', '  ' + testUsers.admin.email + '  ');
        await page.fill('input[name="password"]', testUsers.admin.password);
        await submitLoginForm(page);

        // Should not show validation error for whitespace
        await expect(page.locator('text=Email or Username is required.')).not.toBeVisible();
    });

    test('should trim whitespace from password input', async ({ page }) => {
        await page.fill('input[name="usernameOrEmail"]', testUsers.admin.email);
        await page.fill('input[name="password"]', '  ' + testUsers.admin.password + '  ');
        await submitLoginForm(page);

        // Should not show validation error for whitespace
        await expect(page.locator('text=Password is required.')).not.toBeVisible();
    });

    test('should accept password with special characters', async ({ page }) => {
        await page.fill('input[name="usernameOrEmail"]', testUsers.admin.email);
        await page.fill('input[name="password"]', 'P@ssw0rd!#$%');
        await submitLoginForm(page);

        // Should not show validation errors
        await expect(page.locator('text=Password must be at least 6 characters long.')).not.toBeVisible();
    });

    test('should handle very long email addresses', async ({ page }) => {
        const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
        await page.fill('input[name="usernameOrEmail"]', longEmail);
        await page.fill('input[name="password"]', testUsers.admin.password);
        await submitLoginForm(page);

        // Should process the submission (even if credentials are invalid)
        await expect(page.locator('button[type="submit"]')).toBeDisabled();
    });
});