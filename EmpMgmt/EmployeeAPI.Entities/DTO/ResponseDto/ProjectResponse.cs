using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class ProjectResponse
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = default!;
    public ProjectStatus Status { get; set; }
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? CreatedOn { get; set; }
    public int TaskCount { get; set; }
    public int CompletedTaskCount { get; set; }
    public int ProgressPercentage { get; set; }
}
