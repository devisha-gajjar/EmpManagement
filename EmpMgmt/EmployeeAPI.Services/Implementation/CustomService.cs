using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeAPI.Services.Implementation;

public class CustomService(IUserRepository userRepository, IConfiguration config) : ICustomService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IConfiguration _config = config;


    #region PasswordHash
    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool Verify(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
    #endregion 

    #region Token
    public string GenerateJwtToken(string name)
    {
        User user = _userRepository.GetAll().Include(u => u.Role).FirstOrDefault(u => u.Username == name) ?? throw new AppException(Constants.UNAUTHORIZED_USER);

        JwtSecurityTokenHandler tokenHandler = new();
        byte[] key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]!);

        Claim[]? authClaims =
            [
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.RoleName!),
                new Claim(ClaimTypes.Name,user.UserId.ToString()),
                new Claim(ClaimTypes.GivenName, user.Username),
                new Claim("2fa", "true")
            ];

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);


        JwtSecurityToken token = new(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: authClaims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return tokenHandler.WriteToken(token);
    }

    public string GenerateTempToken(int userId)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        byte[] key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]!);

        var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim("type", "2fa")
    };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(5),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        );

        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal? ValidateTempToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

        try
        {
            var principal = tokenHandler.ValidateToken(
                token,
                new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),

                    ClockSkew = TimeSpan.Zero
                },
                out _
            );

            return principal;
        }
        catch (SecurityTokenExpiredException)
        {
            throw new AppException(Constants.EXPIRED_TOKEN_MESSAGE, StatusCodes.Status401Unauthorized);
        }
        catch (Exception ex) when (
            ex is SecurityTokenException ||
            ex is ArgumentException ||
            ex is FormatException
        )
        {
            throw new AppException(Constants.INVALID_TOKEN_FORMAT_MESSAGE, StatusCodes.Status401Unauthorized);
        }

        catch (Exception ex)
        {
            throw new AppException(ex.Message, StatusCodes.Status500InternalServerError);
        }
    }
    #endregion

    #region File Management
    public async Task<string?> SaveFile(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0) return null;

        string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);
        Directory.CreateDirectory(wwwrootPath);

        string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        string filePath = Path.Combine(wwwrootPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        string finalFileName = Path.Combine(folderName, fileName).Replace("\\", "/");
        return finalFileName;
    }

    public bool DeleteFile(string relativeFilePath)
    {
        if (string.IsNullOrWhiteSpace(relativeFilePath))
            return false;

        try
        {
            string fullPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads",
                relativeFilePath
            );
            fullPath = Path.GetFullPath(fullPath);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }
    #endregion
}
