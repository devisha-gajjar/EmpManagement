using EmployeeAPI.Entities.Models;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class ProjectMemberResponse
{
    public int ProjectMemberId { get; set; }
    public int ProjectId { get; set; }
    public int UserId { get; set; }
    public ProjectRole Role { get; set; }
    public DateTime AddedOn { get; set; }
    public UserBasicDto user { get; set; }
}
