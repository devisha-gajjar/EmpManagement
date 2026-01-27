using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using EmployeeAPI.Entities.Data;
using System.Text.Json;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using System.Security.Claims;
using EmployeeAPI.Entities.Helper;

namespace EmployeeAPI.Controllers;

[EnableCors("AllowAll")]
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService, EmployeeMgmtContext db, ICustomService customService, IConfiguration configuration, ITwoFactorService twoFactorService) : ControllerBase
{
    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto dto)
    {
        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            Zipcode = dto.Zipcode,
            RoleId = dto.RoleId,
            CreatedOn = DateTime.Now
        };

        var registeredUser = authService.Register(user, dto.Password);
        if (registeredUser == null)
            return BadRequest("User with this email or username already exists.");

        return Ok(new { Message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var result = await authService.Login(dto);
        if (result.RefreshToken is not null)
            SetRefreshTokenCookie(result.RefreshToken, dto.RememberMe);
        return Ok(result);
    }

    private void SetRefreshTokenCookie(string refreshToken, bool rememberMe)
    {
        var expiryTime = rememberMe
                ? DateTime.UtcNow.AddDays(double.Parse(configuration["RememberMeExpiryDays"] ?? throw new AppException(Constants.REFRESH_TOKEN_EXPIRYTIME_NOT_CONFIGURED_MESSAGE)))
                : DateTime.UtcNow.AddHours(double.Parse(configuration["RefreshTokenExpiryHours"] ?? throw new AppException(Constants.REFRESH_TOKEN_EXPIRYTIME_NOT_CONFIGURED_MESSAGE)));

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = expiryTime
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"] ?? throw new AppException("No refresh token is found!");

        var (newAccessToken, newRefreshToken) =
            await authService.ValidateRefreshTokens(refreshToken);

        SetRefreshTokenCookie(newRefreshToken, rememberMe: true);

        return Ok(new
        {
            accessToken = newAccessToken
        });
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        GoogleJsonWebSignature.Payload payload;

        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience =
                [
                    configuration["Authentication:Google:ClientId"]
                ]
            };

            // Blocking call instead of async/await
            payload = await GoogleJsonWebSignature
                        .ValidateAsync(dto.IdToken, settings);
        }
        catch
        {
            return BadRequest("Invalid Google token.");
        }

        var user = db.Users.FirstOrDefault(u => u.Email == payload.Email && !u.IsDeleted);
        if (user == null)
        {
            user = new User
            {
                Email = payload.Email,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Username = payload.Email, // or generate unique username
                Password = "", // no password for Google login
                RoleId = 2, // default role id
                CreatedOn = DateTime.Now,
                IsDeleted = false,
                ProfilePicture = payload.Picture
            };

            db.Users.Add(user);
            db.SaveChanges();
        }

        var token = customService.GenerateJwtToken(user.Username);

        return Ok(new { Token = token });
    }

    [HttpPost("facebook-login")]
    public async Task<IActionResult> FacebookLogin([FromBody] FacebookLoginDto dto)
    {
        using var httpClient = new HttpClient();

        var result = await httpClient.GetAsync(
            $"https://graph.facebook.com/me?access_token={dto.AccessToken}&fields=id,name,email");

        if (!result.IsSuccessStatusCode)
            return Unauthorized("Invalid Facebook token");

        var content = result.Content.ReadAsStringAsync().GetAwaiter().GetResult();
        var fbUser = JsonSerializer.Deserialize<FacebookUser>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (fbUser == null || string.IsNullOrWhiteSpace(fbUser.Email))
            return BadRequest("Facebook account email is required.");

        var user = db.Users.FirstOrDefault(u => u.Email == fbUser.Email && !u.IsDeleted);
        if (user == null)
        {
            user = new User
            {
                Email = fbUser.Email,
                FirstName = fbUser.FirstName,
                LastName = fbUser.LastName,
                Username = fbUser.Email,
                Password = "", // No password
                RoleId = 2,
                CreatedOn = DateTime.Now,
                IsDeleted = false,
                ProfilePicture = fbUser.Picture?.Data?.Url
            };

            db.Users.Add(user);
            db.SaveChanges();
        }

        var token = customService.GenerateJwtToken(user.Username);

        return Ok(new { Token = token });
    }

    [HttpPost("verify-2fa")]
    public async Task<IActionResult> Verify2FA([FromBody] Verify2FADto dto)
    {
        var result = await authService.VerifyTwoFactorAsync(dto);
        SetRefreshTokenCookie(result.RefreshToken!, result.RememberMe);
        return Ok(result);
    }

    [HttpPost("2fa/setup")]
    public ActionResult<TwoFactorSetupDto> SetupTwoFactor()
    {
        // UserId comes from JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
            return Unauthorized();

        int userId = int.Parse(userIdClaim);

        var result = twoFactorService.Generate2FASetup(userId);

        return Ok(result);
    }
}

