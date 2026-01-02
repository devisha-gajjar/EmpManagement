using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Services.IServices;

public interface IUserDocumentService
{
    Task<List<UserDocumentResponseDto>> UploadDocumentsAsync(UploadUserDocumentsRequestDto dto);
    Task<List<UserDocumentResponseDto>> GetAllAsync(DocumentStatus? status);
    Task<List<UserDocumentResponseDto>> GetByUserAsync();
    Task UpdateStatusAsync(int documentId, DocumentStatus status, string? remarks
    );
}
