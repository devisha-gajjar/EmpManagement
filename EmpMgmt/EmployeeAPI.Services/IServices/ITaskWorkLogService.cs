using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface ITaskWorkLogService
{
    Task<TaskWorkLogListResponseDto> GetWorkLogsByTaskIdAsync(int taskId);
}
