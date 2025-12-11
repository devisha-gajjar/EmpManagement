using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using EmployeeAPI.Entities.Models;
using System.Linq.Expressions;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.DTO.RequestDto;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation
{
    public class LeaveService(ILeaveRepository _leaveRepo, IMapper mapper) : ILeaveService
    {
        public async Task<LeaveRequest> ApplyLeaveAsync(CreateLeaveRequestDto model)
        {
            LeaveRequest leave;

            // UPDATE
            if (model.LeaveRequestId > 0)
            {
                leave = _leaveRepo.GetById(model.LeaveRequestId) ?? throw new AppException("Leave request not found"); ;

                leave.LeaveType = model.LeaveType;
                leave.StartDate = model.StartDate;
                leave.EndDate = model.EndDate;
                leave.Reason = model.Reason;

                _leaveRepo.Update(leave);
            }
            // CREATE
            else
            {
                leave = new LeaveRequest
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
            }
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
                .OrderByDescending(l => l.Status)
                .ToList();
        }

        public async Task<LeaveListDto?> GetLeaveWithUser(int id)
        {
            var leave = await _leaveRepo.GetByInclude(l => l.LeaveRequestId == id, includes: l => l.Include(lu => lu.User));

            return mapper.Map<LeaveListDto>(leave);
        }

        public async Task<bool> DeleteLeave(int id)
        {
            var emp = _leaveRepo.GetById(id);
            if (emp == null)
                return false;

            _leaveRepo.Delete(emp);
            return true;
        }
    }
}
