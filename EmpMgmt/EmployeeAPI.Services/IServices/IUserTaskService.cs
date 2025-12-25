using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface IUserTaskService
{
    Task<TaskResponseDto> UpsertAsync(TaskDto dto);
    Task<bool> DeleteAsync(int taskId);
}
