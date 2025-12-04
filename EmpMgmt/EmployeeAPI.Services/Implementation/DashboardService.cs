using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation
{
    public class DashboardService : IDashboardService
    {
        private readonly EmployeeMgmtContext _db;

        public DashboardService(EmployeeMgmtContext db)
        {
            _db = db;
        }

        public async Task<EmployeeDashboardDTO> GetEmployeeDashboardAsync(int userId)
        {
            var employee = await _db.Users
                .Where(u => u.UserId == userId)
                .Include(u => u.EmployeeDepartments)  // Include the link table between users and departments
                .ThenInclude(ed => ed.Department)  // Then include the Department entity itself
                .Include(u => u.Role)  // Include Role of the user
                .FirstOrDefaultAsync();

            if (employee == null || (employee.Role?.RoleName == "Admin"))
            {
                throw new AppException("Employee not found or insufficient permissions");
            }

            // Get the first department (assuming only one department per user for simplicity)
            var department = employee.EmployeeDepartments?.FirstOrDefault()?.Department;

            // Manager name (assuming employee has a department manager)
            var managerName = department?.ManagerId != null
                ? await _db.Users
                    .Where(u => u.UserId == department.ManagerId)
                    .Select(u => $"{u.FirstName} {u.LastName}")
                    .FirstOrDefaultAsync()
                : "No manager assigned";

            // Prepare dashboard DTO
            var dashboard = new EmployeeDashboardDTO
            {
                FullName = $"{employee.FirstName} {employee.LastName}",
                Position = employee.Position,
                EmploymentStartDate = employee.EmploymentStartDate,
                DateOfBirth = employee.DateOfBirth,
                Department = department != null
                    ? new DepartmentDTO
                    {
                        DepartmentName = department.Name,
                        ManagerName = managerName
                    }
                    : null,

                // attendance data
                TotalPresentDays = await _db.Attendances
                    .Where(a => a.UserId == userId && a.Status == "Present")
                    .CountAsync(),
                TotalAbsentDays = await _db.Attendances
                    .Where(a => a.UserId == userId && a.Status == "Absent")
                    .CountAsync(),

                // total leave days (if endDate is after startDate)
                TotalLeaveDays = await _db.LeaveRequests
                    .Where(l => l.UserId == userId)
                    .SumAsync(l => (int?)(l.EndDate - l.StartDate).TotalDays) ?? 0,

                // user tasks 
                TotalTasksAssigned = await _db.UserTasks
                    .Where(t => t.UserId == userId)
                    .CountAsync(),
                PendingTasks = await _db.UserTasks
                    .Where(t => t.UserId == userId && t.Status == "Pending")
                    .CountAsync(),
                CompletedTasks = await _db.UserTasks
                    .Where(t => t.UserId == userId && t.Status == "Completed")
                    .CountAsync(),

                // leave requests
                LeaveRequests = await _db.LeaveRequests
                    .Where(l => l.UserId == userId)
                    .Select(l => new LeaveRequestDTO
                    {
                        LeaveType = l.LeaveType,
                        StartDate = l.StartDate,
                        EndDate = l.EndDate,
                        Status = l.Status
                    })
                    .ToListAsync(),

                // tasks
                Tasks = await _db.UserTasks
                    .Where(t => t.UserId == userId)
                    .Select(t => new TaskDTO
                    {
                        TaskName = t.TaskName,
                        Status = t.Status,
                        DueDate = t.DueDate,
                        Priority = t.Priority
                    })
                    .ToListAsync(),
            };

            return dashboard;
        }
    }
}
