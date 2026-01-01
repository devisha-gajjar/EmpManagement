using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation;

public class TaskWorkLogService(IGenericRepository<TaskWorkLog> taskWorkLogRepository, IGenericRepository<UserTask> taskRepository) : ITaskWorkLogService
{
    public async Task<TaskWorkLogListResponseDto> GetWorkLogsByTaskIdAsync(int taskId)
    {
        // 1️⃣ Fetch task
        var task = taskRepository.GetById(taskId)
            ?? throw new AppException("Task not found");

        // 2️⃣ Fetch work logs WITH User include
        var logs = await taskWorkLogRepository
            .GetQueryableInclude(
                includes:
                [
                wl => wl.User
                ]
            )
            .Where(wl => wl.TaskId == taskId)
            .OrderByDescending(wl => wl.LogDate)
            .ToListAsync();

        // 3️⃣ Map response
        return new TaskWorkLogListResponseDto
        {
            TaskId = task.TaskId,
            TaskName = task.TaskName,
            WorkLogs = [.. logs.Select(wl => new TaskWorkLogResponseDto
            {
                WorkLogId = wl.WorkLogId,
                LogDate = wl.LogDate,
                HoursSpent = wl.HoursSpent,
                Description = wl.Description,
                UserId = wl.UserId,
                UserName = wl.User.Username,
                CreatedOn = wl.CreatedOn,
                UpdatedOn = wl.UpdatedOn
            })]
        };
    }

}
