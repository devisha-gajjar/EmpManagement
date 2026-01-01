using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface IUserDocumentService
{
    Task<List<UserDocumentResponseDto>> UploadDocumentsAsync(
       UploadUserDocumentsRequestDto dto
   );
}
