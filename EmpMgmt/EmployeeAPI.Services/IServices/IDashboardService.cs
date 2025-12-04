using EmployeeAPI.Entities.DTO;

namespace EmployeeAPI.Services.IServices;

public interface IDashboardService
{
    Task<EmployeeDashboardDTO> GetEmployeeDashboardAsync(int userId);
}
