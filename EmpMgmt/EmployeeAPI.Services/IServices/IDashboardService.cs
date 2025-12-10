using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface IDashboardService
{
    Task<EmployeeDashboardDTO> GetEmployeeDashboardAsync(int userId);
}
