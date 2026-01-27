using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ClosedXML.Excel;
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

        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? throw new AppException(Constants.JWT_KEY_ERROR_MESSAGE);

        byte[] key = Encoding.UTF8.GetBytes(jwtSecret);

        Claim[] authClaims =
        [
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.RoleName!),
            new Claim(ClaimTypes.Name, user.UserId.ToString()),
            new Claim(ClaimTypes.GivenName, user.Username),
            new Claim("2fa", "true")
        ];

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256
        );

        JwtSecurityToken token = new(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: authClaims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateTempToken(int userId, bool rememberMe)
    {
        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
           ?? throw new AppException("JWT_SECRET not configured");

        byte[] key = Encoding.UTF8.GetBytes(jwtSecret);

        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("type", "2fa"),
            new Claim(ClaimTypes.UserData,rememberMe.ToString()),
        };

        var credentials = new SigningCredentials(
                 new SymmetricSecurityKey(key),
                 SecurityAlgorithms.HmacSha256
             );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(5),
            signingCredentials: credentials
        );

        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal? ValidateTempToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
           ?? throw new AppException("JWT_SECRET not configured");

        byte[] key = Encoding.UTF8.GetBytes(jwtSecret);

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

    #region Excel Export
    public MemoryStream ExportToExcel<T>(List<T> data, string sheetName, XLTableTheme? tableTheme, int startRow = 10, int startCol = 1, Action<IXLWorksheet>? setup = null)
    {
        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add(sheetName);

        string logoPath = Constants.LOGO_PATH;
        if (File.Exists(logoPath))
        {
            ws.AddPicture(logoPath).MoveTo(ws.Cell("D2")).WithSize(320, 70);
        }

        setup?.Invoke(ws);

        // Insert table
        var table = ws.Cell(startRow, startCol).InsertTable(data, sheetName + "Table", true);
        table.Theme = tableTheme ?? XLTableTheme.TableStyleMedium2;
        table.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        table.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

        ws.Columns().AdjustToContents();

        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;
        return stream;
    }
    #endregion Excel Export
}
