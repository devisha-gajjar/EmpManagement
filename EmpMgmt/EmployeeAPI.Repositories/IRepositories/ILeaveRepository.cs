using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Repositories.IRepositories
{
    public interface ILeaveRepository : IGenericRepository<LeaveRequest>
    {
        IEnumerable<LeaveRequest> GetUserLeaveHistory(int userId);
    }
}
