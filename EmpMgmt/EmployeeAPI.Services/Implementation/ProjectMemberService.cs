using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation;

public class ProjectMemberService(IGenericRepository<ProjectMember> projectMemberRepository, IMapper mapper, IGenericRepository<User> userRepository, INotificationService notificationService) : IProjectMemberService
{
    public async Task<ProjectMemberResponse> AddOrUpdateMember(ProjectMemberRequest request)
    {
        ProjectMember entity;
        bool isNewMember = false;

        if (request.ProjectMemberId > 0)
        {
            // Update existing member
            entity = await projectMemberRepository.GetByInclude(
                x => x.ProjectMemberId == request.ProjectMemberId
            ) ?? throw new AppException(Constants.PROJECT_MEM_NOT_FOUND);

            entity.Role = (int)request.Role;
            projectMemberRepository.Update(entity);
        }
        else
        {
            // Check if user already assigned
            var userAlreadyAssigned = await projectMemberRepository.Exists(x =>
                x.ProjectId == request.ProjectId &&
                x.UserId == request.UserId
            );

            if (userAlreadyAssigned)
                throw new AppException(Constants.PROJECT_MEM_ALREADY_ASSIGNED_TO_PROJECT);

            entity = new ProjectMember
            {
                ProjectId = request.ProjectId,
                UserId = request.UserId,
                Role = (int)request.Role,
                AddedOn = DateTime.UtcNow
            };

            projectMemberRepository.Add(entity);
            isNewMember = true;
        }

        // Send notification
        var user = await userRepository.GetByInclude(u => u.UserId == entity.UserId);

        Console.WriteLine("Request role" + request.Role);
        if (user != null)
        {
            string title = isNewMember ? "Added to Project" : "Project Role Updated";
            string message = isNewMember
                ? $"You have been added to Project ID {entity.ProjectId} with role {request.Role}"
                : $"Your role for Project ID {entity.ProjectId} has been updated to {request.Role}";

            await notificationService.AddNotificationAsync(new NotificationRequestDto
            {
                UserId = entity.UserId,
                Title = title,
                Message = message,
                Type = isNewMember ? "ProjectAssigned" : "RoleUpdated",
                ReferenceId = entity.ProjectId
            });
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
