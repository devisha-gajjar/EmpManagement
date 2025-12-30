namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class TaskResponseDto
{
    public int TaskId { get; set; }
    public int ProjectId { get; set; }
    public int? UserId { get; set; }

    public string TaskName { get; set; } = null!;
    public string? Description { get; set; }

    public string Priority { get; set; } = null!;
    public string Status { get; set; } = null!;

    public DateTime StartDate { get; set; }
    public DateTime DueDate { get; set; }

    public decimal? EstimatedHours { get; set; }
}
