using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices
{
    public interface ILeaveService
    {
        Task<LeaveRequest> ApplyLeaveAsync(CreateLeaveRequestDto model);
        Task<bool> ApproveLeaveAsync(int leaveRequestId);
        Task<bool> DenyLeaveAsync(int leaveRequestId);
        IEnumerable<LeaveRequest> GetUserLeaveHistory(int userId);
        IEnumerable<LeaveListDto> GetLeaveList();
        Task<LeaveListDto?> GetLeaveWithUser(int leaveRequestId);
        Task<bool> DeleteLeave(int id);
    }
}
