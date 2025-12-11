using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Services;

public class ProjectMemberService(IGenericRepository<ProjectMember> projectMemberRepository, IMapper mapper) : IProjectMemberService
{
    public async Task<ProjectMemberResponse> AddMember(ProjectMemberRequest request)
    {
        var entity = new ProjectMember
        {
            ProjectId = request.ProjectId,
            UserId = request.UserId,
            Role = (int)request.Role,
            AddedOn = DateTime.UtcNow
        };

        projectMemberRepository.Add(entity);

        return mapper.Map<ProjectMemberResponse>(entity);
    }

    public async Task<ProjectMemberResponse> UpdateMember(int projectMemberId, ProjectMemberRequest request)
    {
        var entity = await projectMemberRepository.GetByInclude(x => x.ProjectMemberId == projectMemberId) ?? throw new AppException(Constants.PROJECT_MEM_NOT_FOUND);

        entity.Role = (int)request.Role;

        return mapper.Map<ProjectMemberResponse>(entity);
    }

    public async Task<bool> DeleteMember(int projectMemberId)
    {
        var entity = await projectMemberRepository.GetByInclude(x => x.ProjectMemberId == projectMemberId) ?? throw new AppException(Constants.PROJECT_MEM_NOT_FOUND);

        projectMemberRepository.Delete(entity);

        return true;
    }

    public async Task<ProjectMemberResponse?> GetMember(int projectMemberId)
    {
        var entity = await projectMemberRepository.GetByInclude(x => x.ProjectMemberId == projectMemberId) ?? throw new AppException(Constants.PROJECT_MEM_NOT_FOUND);

        return mapper.Map<ProjectMemberResponse>(entity);
    }

    public async Task<List<ProjectMemberResponse>> GetMembersByProject(int projectId)
    {
        var query = projectMemberRepository.GetQueryableInclude();

        var members = await query
            .Where(x => x.ProjectId == projectId)
            .ToListAsync();

        return mapper.Map<List<ProjectMemberResponse>>(members);
    }
}
