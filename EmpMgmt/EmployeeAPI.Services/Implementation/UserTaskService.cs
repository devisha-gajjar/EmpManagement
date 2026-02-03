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

public class UserTaskService(
    IGenericRepository<UserTask> taskRepository,
    IMapper mapper) : IUserTaskService
{
    public async Task<TaskResponseDto> UpsertAsync(TaskDto dto)
    {
        UserTask task;

        if (dto.TaskId == null || dto.TaskId == 0)
        {
            task = mapper.Map<UserTask>(dto);

            task.UserId = dto.UserId;
            task.CreatedOn = DateTime.Now;
            task.UpdatedOn = DateTime.Now;

            taskRepository.Add(task);
        }
        else
        {
            task = taskRepository.GetById(dto.TaskId.Value)
                ?? throw new AppException(Constants.TASK_NOT_FOUND);

            mapper.Map(dto, task);
            task.UpdatedOn = DateTime.Now;

            if (dto.Status == "Completed")
                task.CompletedOn = DateTime.Now;

            taskRepository.Update(task);
        }

        return mapper.Map<TaskResponseDto>(task);
    }

    public async Task<TaskResponseDto?> GetById(int taskId)
    {
        var task = await taskRepository.GetByInclude(u => u.TaskId == taskId, query => query.Include(x => x.User)) ?? throw new AppException("Task not found");

        return mapper.Map<TaskResponseDto>(task);
    }

    public async Task<bool> DeleteAsync(int taskId)
    {
        var task = taskRepository.GetById(taskId);
        if (task == null) return false;

        taskRepository.Delete(task);
        return true;
    }
}
