using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Entities.DTO.RequestDto;

public class ProjectMemberRequest
{
    public int ProjectMemberId { get; set; }
    public int ProjectId { get; set; }
    public int UserId { get; set; }
    public ProjectRole Role { get; set; } = ProjectRole.Developer;
}
