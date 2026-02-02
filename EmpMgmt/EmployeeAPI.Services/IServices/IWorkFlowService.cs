using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface IWorkFlowService
{
    Task<List<TaskResponseDto>> GetTasksByUserIdAsync();
}
