namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class TaskWorkLogListResponseDto
{
    public int TaskId { get; set; }
    public string TaskName { get; set; } = string.Empty;
    public List<TaskWorkLogResponseDto> WorkLogs { get; set; } = [];
}
