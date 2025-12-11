using System.Security.Claims;
using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;

namespace EmployeeAPI.Services.Implementation;

public class ProjectService(IMapper mapper, IGenericRepository<Project> projectRepository, IHttpContextAccessor httpContextAccessor) : IProjectService
{
    public int UserId => httpContextAccessor.HttpContext?.User?.GetUserId() ?? throw new UnauthorizedAccessException(Constants.UNAUTHORIZED_USER);

    public async Task<IEnumerable<ProjectResponse>> GetAllProjects()
    {
        var projects = projectRepository.GetAll()
                        ?? throw new AppException(Constants.PROJECT_NOT_FOUND);

        return mapper.Map<IEnumerable<ProjectResponse>>(projects.ToList());
    }

    public async Task<ProjectResponse> SaveProject(ProjectRequest request)
    {
        Project project;

        // Update
        if (request.ProjectId > 0)
        {
            project = projectRepository.GetById(request.ProjectId)
                    ?? throw new AppException(Constants.PROJECT_NOT_FOUND);

            mapper.Map(request, project);

            project.ModifiedBy = UserId;
            project.UpdatedOn = DateTime.UtcNow;

            projectRepository.Update(project);
        }
        else
        {
            // Create
            project = mapper.Map<Project>(request);

            project.CreatedBy = UserId;
            project.CreatedOn = DateTime.UtcNow;
            project.UpdatedOn = DateTime.UtcNow;

            projectRepository.Add(project);
        }

        var savedProject = projectRepository.GetById(project.ProjectId);
        return mapper.Map<ProjectResponse>(savedProject);
    }

    public async Task<ProjectResponse> GetProjectById(int projectId)
    {
        var project = projectRepository.GetById(projectId)
                      ?? throw new AppException(Constants.PROJECT_NOT_FOUND);

        return mapper.Map<ProjectResponse>(project);
    }

    public async Task<bool> DeleteProject(int projectId)
    {
        var project = projectRepository.GetById(projectId)
                      ?? throw new AppException(Constants.PROJECT_NOT_FOUND);

        projectRepository.Delete(project);
        return true;
    }

}
