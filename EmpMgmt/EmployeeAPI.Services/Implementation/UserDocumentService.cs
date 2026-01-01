using AutoMapper;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace EmployeeAPI.Services.Implementation;

public class UserDocumentService(
    IGenericRepository<UserDocument> repository,
    IWebHostEnvironment env,
    IHttpContextAccessor httpContextAccessor,
    IMapper mapper
) : IUserDocumentService
{
    private int UserId =>
        httpContextAccessor.HttpContext?.User?.GetUserId()
        ?? throw new UnauthorizedAccessException(Constants.UNAUTHORIZED_USER);

    public async Task<List<UserDocumentResponseDto>> UploadDocumentsAsync(
        UploadUserDocumentsRequestDto dto)
    {
        var uploadFolder = Path.Combine(
            env.WebRootPath,
            "uploads",
            "users",
            UserId.ToString()
        );

        if (!Directory.Exists(uploadFolder))
            Directory.CreateDirectory(uploadFolder);

        var documents = new List<UserDocument>();

        foreach (var file in dto.Files)
        {
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            documents.Add(new UserDocument
            {
                UserId = UserId,
                DocumentName = file.FileName,
                DocumentType = dto.DocumentType,
                FilePath = filePath,
                ContentType = file.ContentType,
                FileSize = file.Length,
                Status = "Pending",
                UploadedOn = DateTime.UtcNow
            });
        }

        repository.AddRange(documents);

        return mapper.Map<List<UserDocumentResponseDto>>(documents);
    }
}
