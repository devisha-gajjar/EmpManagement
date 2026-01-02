using Microsoft.AspNetCore.Http;

namespace EmployeeAPI.Services.IServices;

public interface ICustomService
{
    public string Hash(string password);
    public bool Verify(string password, string hashedPassword);
    public string GenerateJwtToken(string name);
    Task<string?> SaveFile(IFormFile file, string folderName);
    bool DeleteFile(string relativeFilePath);
}
