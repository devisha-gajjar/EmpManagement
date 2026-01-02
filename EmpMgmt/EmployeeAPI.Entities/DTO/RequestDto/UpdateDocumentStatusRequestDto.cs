using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Entities.DTO.RequestDto;

public class UpdateDocumentStatusRequestDto
{
    public DocumentStatus Status { get; set; }
    public string? Remarks { get; set; }
}
