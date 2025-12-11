using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface IProjectMemberService
{
    Task<ProjectMemberResponse> AddMember(ProjectMemberRequest request);
    Task<ProjectMemberResponse> UpdateMember(int projectMemberId, ProjectMemberRequest request);
    Task<bool> DeleteMember(int projectMemberId);
    Task<ProjectMemberResponse?> GetMember(int projectMemberId);
    Task<List<ProjectMemberResponse>> GetMembersByProject(int projectId);
}
