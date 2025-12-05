using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.Implementation
{
    public class LeaveService : ILeaveService
    {
        private readonly ILeaveRepository _leaveRepo;

        public LeaveService(ILeaveRepository leaveRepo)
        {
            _leaveRepo = leaveRepo;
        }

        public async Task<LeaveRequest> ApplyLeaveAsync(CreateLeaveRequestDto model)
        {
            var leave = new LeaveRequest
            {
                UserId = model.UserId,
                LeaveType = model.LeaveType,
                Reason = model.Reason,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                Status = "Pending",
                CreatedOn = DateTime.UtcNow
            };

            _leaveRepo.Add(leave);
            return leave;
        }

        public async Task<bool> ApproveLeaveAsync(int leaveRequestId)
        {
            var leave = _leaveRepo.GetById(leaveRequestId);
            if (leave == null) return false;

            leave.Status = "Approved";
            _leaveRepo.Update(leave);

            return true;
        }

        public async Task<bool> DenyLeaveAsync(int leaveRequestId)
        {
            var leave = _leaveRepo.GetById(leaveRequestId);
            if (leave == null) return false;

            leave.Status = "Denied";
            _leaveRepo.Update(leave);

            return true;
        }

        public IEnumerable<LeaveRequest> GetUserLeaveHistory(int userId)
        {
            return _leaveRepo.GetUserLeaveHistory(userId);
        }
    }
}
