using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;

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
            task.CreatedOn = DateTime.UtcNow;
            task.UpdatedOn = DateTime.UtcNow;

            taskRepository.Add(task);
        }
        else
        {
            task = taskRepository.GetById(dto.TaskId.Value)
                ?? throw new AppException(Constants.TASK_NOT_FOUND);

            mapper.Map(dto, task);
            task.UpdatedOn = DateTime.UtcNow;

            if (dto.Status == "Completed")
                task.CompletedOn = DateTime.UtcNow;

            taskRepository.Update(task);
        }

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
