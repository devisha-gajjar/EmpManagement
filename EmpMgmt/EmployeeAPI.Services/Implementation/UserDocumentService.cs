using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Services.Implementation;

public class UserDocumentService(
    IGenericRepository<UserDocument> repository,
    IHttpContextAccessor httpContextAccessor,
    ICustomService customService,
    IMapper mapper
) : IUserDocumentService
{
    private int UserId =>
        httpContextAccessor.HttpContext?.User?.GetUserId()
        ?? throw new UnauthorizedAccessException(Constants.UNAUTHORIZED_USER);

    public async Task<List<UserDocumentResponseDto>> UploadDocumentsAsync(
        UploadUserDocumentsRequestDto dto)
    {
        var folderPath = Path.Combine("users", UserId.ToString());

        var documents = new List<UserDocument>();

        foreach (var file in dto.Files)
        {
            var savedPath = await customService.SaveFile(file, folderPath);

            if (string.IsNullOrEmpty(savedPath))
                continue;

            documents.Add(new UserDocument
            {
                UserId = UserId,
                DocumentName = file.FileName,
                DocumentType = dto.DocumentType,
                FilePath = savedPath,
                ContentType = file.ContentType,
                FileSize = file.Length,
                Status = "Pending",
                UploadedOn = DateTime.Now
            });
        }

        repository.AddRange(documents);

        return mapper.Map<List<UserDocumentResponseDto>>(documents);
    }

    public async Task<List<UserDocumentResponseDto>> GetAllAsync(DocumentStatus? status)
    {
        var query = repository.GetQueryableInclude(includes: [x => x.User]);

        if (status.HasValue)
        {
            var statusValue = status.Value.ToString();
            query = query.Where(x => x.Status == statusValue);
        }

        var documents = query
            .OrderByDescending(x => x.UploadedOn)
            .ToList();

        return mapper.Map<List<UserDocumentResponseDto>>(documents);
    }

    // USER – MY DOCUMENTS
    public async Task<List<UserDocumentResponseDto>> GetByUserAsync()
    {
        var documents = repository.GetQueryableInclude
            (includes: [x => x.User])
            .Where(x => x.UserId == UserId)
            .OrderByDescending(x => x.UploadedOn)
            .ToList();

        if (documents.Count == 0)
        {
            throw new AppException("No Document Found");
        }

        return mapper.Map<List<UserDocumentResponseDto>>(documents);
    }

    public async Task UpdateStatusAsync(
    int documentId,
    DocumentStatus status,
    string? remarks)
    {
        var document = repository.GetById(documentId)
            ?? throw new AppException("Document not found");

        // Only Pending documents can be updated
        if (document.Status != DocumentStatus.Pending.ToString())
        {
            throw new AppException("Document status cannot be changed");
        }

        document.Status = status.ToString();
        document.ApprovedOn = DateTime.Now;
        document.ApprovedBy = UserId;
        document.RejectionReason = remarks;

        repository.Update(document);
    }
}
