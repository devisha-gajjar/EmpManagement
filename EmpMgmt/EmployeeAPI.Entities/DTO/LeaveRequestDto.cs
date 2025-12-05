namespace EmployeeAPI.Entities.DTO;

public class LeaveRequestDto
{
    public int LeaveRequestId { get; set; }
    public string LeaveType { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Pending";
}
