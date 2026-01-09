namespace EmployeeAPI.Entities.DTO.RequestDto;

public class NotificationMailDto
{
    public string Email { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string NotificationTitle { get; set; } = null!;
    public string NotificationMessage { get; set; } = null!;
    public string ActionUrl { get; set; } = null!;
}
