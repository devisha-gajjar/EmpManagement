namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class TaskWorkLogResponseDto
{
    public int WorkLogId { get; set; }
    public DateTime LogDate { get; set; }
    public decimal HoursSpent { get; set; }
    public string? Description { get; set; }

    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;

    public DateTime? CreatedOn { get; set; }
    public DateTime? UpdatedOn { get; set; }
}
