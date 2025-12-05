using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Repositories.Implementation
{
    public class LeaveRepository : GenericRepository<LeaveRequest>, ILeaveRepository
    {
        public LeaveRepository(EmployeeMgmtContext db) : base(db)
        {
        }

        public IEnumerable<LeaveRequest> GetUserLeaveHistory(int userId)
        {
            return _db.LeaveRequests
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedOn)
                .AsNoTracking()
                .ToList();
        }
    }
}
