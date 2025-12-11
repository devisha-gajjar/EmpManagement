namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class ProjectResponse
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
