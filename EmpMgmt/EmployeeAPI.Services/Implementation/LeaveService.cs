using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using EmployeeAPI.Entities.Models;
using System.Linq.Expressions;

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

        public IEnumerable<LeaveListDto> GetLeaveList()
        {
            return _leaveRepo
                .GetQueryableInclude(new Expression<Func<LeaveRequest, object>>[]
                {
                    x => x.User
                })
                .Select(l => new LeaveListDto
                {
                    LeaveRequestId = l.LeaveRequestId,
                    UserId = l.UserId,
                    LeaveType = l.LeaveType,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    Status = l.Status,
                    CreatedOn = l.CreatedOn,
                    Reason = l.Reason,
                    User = l.User == null ? null : new UserBasicDto
                    {
                        UserId = l.User.UserId,
                        FirstName = l.User.FirstName,
                        LastName = l.User.LastName,
                        Email = l.User.Email
                    }
                })
                .ToList();
        }

    }
}
