using System.Linq.Expressions;
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

public class ProjectMemberService(IGenericRepository<ProjectMember> projectMemberRepository, IMapper mapper, IGenericRepository<User> userRepository) : IProjectMemberService
{
    public async Task<ProjectMemberResponse> AddOrUpdateMember(ProjectMemberRequest request)
    {
        ProjectMember entity;

        if (request.ProjectMemberId > 0)
        {
            entity = await projectMemberRepository.GetByInclude(
                x => x.ProjectMemberId == request.ProjectMemberId
            ) ?? throw new AppException(Constants.PROJECT_MEM_NOT_FOUND);

            // Update fields
            entity.Role = (int)request.Role;
            projectMemberRepository.Update(entity);
        }
        else
        {
            var userAlreadyAssigned = await projectMemberRepository.Exists(x =>
                      x.ProjectId == request.ProjectId &&
                      x.UserId == request.UserId
                  );

            if (userAlreadyAssigned)
                throw new AppException(Constants.PROJECT_MEM_ALREADY_ASSIGNED_TO_PROJECT);

            var exists = await projectMemberRepository.Exists(x =>
                x.ProjectId == request.ProjectId &&
                x.UserId == request.UserId &&
                x.Role == (int)request.Role
            );

            if (exists)
                throw new AppException(Constants.PROJECT_MEM_ALREADY_ASSIGNED);

            entity = new ProjectMember
            {
                ProjectId = request.ProjectId,
                UserId = request.UserId,
                Role = (int)request.Role,
                AddedOn = DateTime.UtcNow
            };

            projectMemberRepository.Add(entity);
        }

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
        var entity = await projectMemberRepository.GetByInclude(x => x.ProjectMemberId == projectMemberId, query => query.Include(x => x.User)) ?? throw new AppException(Constants.PROJECT_MEM_NOT_FOUND);

        return mapper.Map<ProjectMemberResponse>(entity);
    }

    public async Task<List<ProjectMemberResponse>> GetMembersByProject(int projectId)
    {
        var query = projectMemberRepository.GetQueryableInclude(
            includes:
            [
                pm => pm.User
            ],
            deepIncludes:
            [
                "User.Role",
                "User.EmployeeDepartments",
                "User.EmployeeDepartments.Department"
            ]
        );

        var members = await query
            .Where(pm => pm.ProjectId == projectId)
            .ToListAsync();

        return mapper.Map<List<ProjectMemberResponse>>(members);
    }

    public async Task<List<CommonListDropDownDto>> SearchUsersAsync(string search)
    {
        if (string.IsNullOrWhiteSpace(search))
            return [];

        IQueryable<User> query = userRepository.GetQueryableInclude();

        query = query.Where(x =>
            !x.IsDeleted &&
            (x.FirstName.Contains(search) ||
             x.LastName.Contains(search) ||
             x.Email.Contains(search))
        );

        return await mapper
            .ProjectTo<CommonListDropDownDto>(query)
            .Take(20)
            .ToListAsync();
    }

}
