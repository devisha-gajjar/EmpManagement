namespace EmployeeAPI.Entities.DTO.RequestDto;

public class TaskDto
{
    public int? TaskId { get; set; }
    public int ProjectId { get; set; }
    public int? UserId { get; set; }
    public string TaskName { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime DueDate { get; set; }
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "Pending";
    public decimal? EstimatedHours { get; set; }
}
