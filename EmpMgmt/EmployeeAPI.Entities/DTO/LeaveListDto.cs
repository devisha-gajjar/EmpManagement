namespace EmployeeAPI.Entities.DTO;

public class LeaveListDto
{
    public int LeaveRequestId { get; set; }
    public int? UserId { get; set; }
    public string? LeaveType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedOn { get; set; }
    public string Reason { get; set; } = string.Empty;

    public UserBasicDto? User { get; set; }
}

public class UserBasicDto
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string FullName => $"{FirstName} {LastName}";
}
