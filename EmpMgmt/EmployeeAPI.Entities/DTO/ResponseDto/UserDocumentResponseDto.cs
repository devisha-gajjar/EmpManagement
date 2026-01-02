namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class UserDocumentResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;

    public string DocumentName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;

    public long FileSize { get; set; }
    public string Status { get; set; } = string.Empty;

    public DateTime UploadedOn { get; set; }
}
