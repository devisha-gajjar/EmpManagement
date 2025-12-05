using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices
{
    public interface ILeaveService
    {
        Task<LeaveRequest> ApplyLeaveAsync(CreateLeaveRequestDto model);
        Task<bool> ApproveLeaveAsync(int leaveRequestId);
        Task<bool> DenyLeaveAsync(int leaveRequestId);
        IEnumerable<LeaveRequest> GetUserLeaveHistory(int userId);
    }
}
