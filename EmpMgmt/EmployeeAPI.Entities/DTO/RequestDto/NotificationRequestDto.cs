namespace EmployeeAPI.Entities.DTO.RequestDto;

public class NotificationRequestDto
{
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Type { get; set; } = null!;
    public int? ReferenceId { get; set; }
}
