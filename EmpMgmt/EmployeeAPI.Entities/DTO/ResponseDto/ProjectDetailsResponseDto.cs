namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class ProjectDetailsResponseDto
{
    public ProjectDetailsDto Project { get; set; } = null!;
    public List<ProjectTaskDto> Tasks { get; set; } = [];
}

public class ProjectDetailsDto
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = null!;
}

public class ProjectTaskDto
{
    public int TaskId { get; set; }
    public int ProjectId { get; set; }
    public string TaskName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Priority { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string AssignedTo { get; set; } = null!;
    public int EstimatedHours { get; set; }
    public int SpentHours { get; set; }
    public DateTime DueDate { get; set; }
}
