using System.Security.Claims;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;

namespace EmployeeAPI.Services.IServices;

public interface ICustomService
{
    public string Hash(string password);
    public bool Verify(string password, string hashedPassword);
    public string GenerateJwtToken(string name);
    public string GenerateTempToken(int userId, bool rememberMe);
    ClaimsPrincipal? ValidateTempToken(string token);
    Task<string?> SaveFile(IFormFile file, string folderName);
    bool DeleteFile(string relativeFilePath);
    MemoryStream ExportToExcel<T>(List<T> data, string sheetName, XLTableTheme? tableTheme, int startRow = 10, int startCol = 1, Action<IXLWorksheet>? setup = null);
}
