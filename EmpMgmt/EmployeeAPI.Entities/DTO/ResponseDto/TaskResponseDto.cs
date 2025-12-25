namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class TaskResponseDto
{
    public int TaskId { get; set; }
    public string TaskName { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Priority { get; set; } = null!;
    public DateTime DueDate { get; set; }
}