using System.Linq.Expressions;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation;

public class WorkFlowService(IGenericRepository<UserTask> _taskRepository, IHttpContextAccessor httpContextAccessor) : IWorkFlowService
{
    private int UserId =>
        httpContextAccessor.HttpContext?.User?.GetUserId()
        ?? throw new UnauthorizedAccessException(Constants.UNAUTHORIZED_USER);
    public async Task<List<TaskResponseDto>> GetTasksByUserIdAsync()
    {
        var query = _taskRepository.GetQueryableInclude(
            includes: new Expression<Func<UserTask, object>>[]
            {
            t => t.Project,
            t => t.Tags
            }
        );

        return await query
            .Where(t => t.UserId == UserId)
            .OrderByDescending(t => t.DueDate)
            .Select(t => new TaskResponseDto
            {
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                Status = t.Status,
                Priority = t.Priority,
                DueDate = t.DueDate,
                Description = t.Description,
                ProjectName = t.Project!.ProjectName
            })
            .ToListAsync();
    }

}
