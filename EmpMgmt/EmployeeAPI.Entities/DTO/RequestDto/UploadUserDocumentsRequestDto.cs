using Microsoft.AspNetCore.Http;

namespace EmployeeAPI.Entities.DTO.RequestDto;

public class UploadUserDocumentsRequestDto
{
    public string DocumentType { get; set; } = string.Empty;

    public List<IFormFile> Files { get; set; } = [];
}

public class UserDocumentFileDto
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public Stream Content { get; set; } = default!;
    public long FileSize { get; set; }
}
