namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class NotificationResponseDto
{
    public int NotificationId { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Type { get; set; } = null!;
    public int? ReferenceId { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string EmailSent { get; set; } = null!;
}
