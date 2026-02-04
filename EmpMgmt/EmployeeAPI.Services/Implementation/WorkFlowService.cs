using System.Linq.Expressions;
using System.Text.Json;
using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace EmployeeAPI.Services.Implementation;

public class WorkFlowService(IGenericRepository<UserTask> taskRepository, IGenericRepository<TaskComment> commentRepository, IGenericRepository<TaskWorkLog> workLogRepository, IGenericRepository<TaskActivityLog> activityLogRepository, IHttpContextAccessor httpContextAccessor, IMapper mapper, ISqlQueryRepository sqlQueryRepository) : IWorkFlowService
{
    private int UserId =>
        httpContextAccessor.HttpContext?.User?.GetUserId()
        ?? throw new UnauthorizedAccessException(Constants.UNAUTHORIZED_USER);

    #region Fetch User Task
    public async Task<List<TaskResponseDto>> GetTasksByUserIdAsync()
    {
        var query = taskRepository.GetQueryableInclude(
            includes:
            [
                t => t.Project,
                t => t.Tags
            ]
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
    #endregion

    #region Add comment
    public async Task<TaskCommentDto> AddComment(
     int taskId,
     AddCommentRequestDto dto)
    {
        var entity = mapper.Map<TaskComment>(dto);
        entity.TaskId = taskId;
        entity.CreatedBy = UserId;

        commentRepository.Add(entity);

        return mapper.Map<TaskCommentDto>(entity);
    }
    #endregion

    #region Add WorkLog
    public async Task<(TaskWorkLogDto WorkLog, decimal TotalHours)>
    AddWorkLog(int taskId, AddWorkLogRequestDto dto)
    {
        var entity = mapper.Map<TaskWorkLog>(dto);
        entity.TaskId = taskId;
        entity.UserId = UserId;

        workLogRepository.Add(entity);

        var total = await workLogRepository
            .GetAll()
            .Where(x => x.TaskId == taskId)
            .SumAsync(x => x.HoursSpent);

        return (
            mapper.Map<TaskWorkLogDto>(entity),
            total
        );
    }
    #endregion

    #region Update Task Status
    public async Task<TaskTimelineDto> UpdateStatus(
    int taskId,
    UpdateStatusRequestDto dto)
    {
        var task = taskRepository.GetById(taskId) ?? throw new AppException("No task found");

        var oldStatus = task.Status;
        task.Status = dto.Status;
        task.UpdatedOn = DateTime.UtcNow;

        var activity = new TaskActivityLog
        {
            TaskId = taskId,
            UserId = UserId,
            Action = "STATUS_CHANGED",
            OldValue = oldStatus,
            NewValue = dto.Status
        };

        activityLogRepository.Add(activity);

        return mapper.Map<TaskTimelineDto>(activity);
    }
    #endregion

    #region Fetch Task Details
    public async Task<TaskDetailResponseDto> GetTaskDetails(int taskId)
    {
        string query = @"SELECT get_task_detail_full(@p_task_id)::text AS ""Value""";
        // string query = "SELECT get_task_detail_full(@p_task_id)::text";

        NpgsqlParameter[] parameters =
        {
        new("p_task_id", NpgsqlTypes.NpgsqlDbType.Integer) { Value = taskId }
    };

        // IMPORTANT: map directly to string
        var json = await sqlQueryRepository
            .SqlQuerySingleAsync<string>(query, parameters);

        if (string.IsNullOrWhiteSpace(json))
            throw new AppException("Task not found");

        var result = JsonSerializer.Deserialize<TaskDetailResponseDto>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

        return result ?? throw new AppException("Failed to deserialize task detail");
    }
    #endregion

}
