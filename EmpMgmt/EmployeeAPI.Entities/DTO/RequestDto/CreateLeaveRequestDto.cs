namespace EmployeeAPI.Entities.DTO.RequestDto;
public class CreateLeaveRequestDto
{
    public int LeaveRequestId { get; set; }
    public int UserId { get; set; }
    public string LeaveType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
}

