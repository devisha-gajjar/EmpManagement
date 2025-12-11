using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface IProjectService
{
    Task<IEnumerable<ProjectResponse>> GetAllProjects();
    Task<ProjectResponse> SaveProject(ProjectRequest request);
    Task<ProjectResponse> GetProjectById(int projectId);
    Task<bool> DeleteProject(int projectId);
}
