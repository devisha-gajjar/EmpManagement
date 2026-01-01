namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class UserDocumentResponseDto
{
    public int DocumentId { get; set; }
    public string DocumentName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime UploadedOn { get; set; }
}
