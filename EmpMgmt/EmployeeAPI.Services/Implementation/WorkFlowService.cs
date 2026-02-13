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
        return await taskRepository
            .GetAll()
            .Where(t =>
                t.UserId == UserId ||
                t.Project!.ProjectMembers.Any(pm => pm.UserId == UserId)
            )
            .OrderByDescending(t => t.DueDate)
            .Select(t => new TaskResponseDto
            {
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                Status = t.Status,
                Priority = t.Priority,
                DueDate = t.DueDate,
                Description = t.Description,
                ProjectName = t.Project!.ProjectName,
                UserId = t.UserId
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

        // IMPORTANT: reload including User
        var savedEntity = await commentRepository.GetByInclude(
            x => x.CommentId == entity.CommentId,
            q => q.Include(x => x.Task).ThenInclude(x => x.User)
        );

        return new TaskCommentDto
        {
            CommentId = savedEntity.CommentId,
            Comment = savedEntity.Comment,
            CreatedBy = savedEntity.Task.User!.Username,  // return username here
            CreatedOn = savedEntity.CreatedOn
        };
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

        // After Add(entity) and SaveChanges()
        var savedEntity = await workLogRepository.GetByInclude(
            x => x.WorkLogId == entity.WorkLogId,
            q => q.Include(x => x.User)
        );

        var total = await workLogRepository
            .GetAll()
            .Where(x => x.TaskId == taskId)
            .SumAsync(x => x.HoursSpent);

        return (
            mapper.Map<TaskWorkLogDto>(savedEntity),
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
        task.UpdatedOn = DateTime.Now;

        var activity = new TaskActivityLog
        {
            TaskId = taskId,
            UserId = UserId,
            Action = "STATUS_CHANGED",
            OldValue = oldStatus,
            NewValue = dto.Status
        };

        activityLogRepository.Add(activity);

        var saved = await activityLogRepository.GetByInclude(
                x => x.ActivityId == activity.ActivityId,
                q => q.Include(x => x.User)
            );

        return mapper.Map<TaskTimelineDto>(saved);
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
