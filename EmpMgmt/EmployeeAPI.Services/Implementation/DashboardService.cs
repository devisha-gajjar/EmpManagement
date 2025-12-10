using System.Linq.Expressions;
using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation;

public class DashboardService : IDashboardService
{
    private readonly IGenericRepository<User> _userRepo;
    private readonly IGenericRepository<Attendance> _attendanceRepo;
    private readonly IGenericRepository<LeaveRequest> _leaveRepo;
    private readonly IGenericRepository<UserTask> _taskRepo;

    public DashboardService(
        IGenericRepository<User> userRepo,
        IGenericRepository<Attendance> attendanceRepo,
        IGenericRepository<LeaveRequest> leaveRepo,
        IGenericRepository<UserTask> taskRepo)
    {
        _userRepo = userRepo;
        _attendanceRepo = attendanceRepo;
        _leaveRepo = leaveRepo;
        _taskRepo = taskRepo;
    }

    public async Task<EmployeeDashboardDTO> GetEmployeeDashboardAsync(int userId)
    {
        var employee = await _userRepo.GetQueryableInclude(
                includes: new Expression<Func<User, object>>[]
                {
                    u => u.Role,
                    u => u.EmployeeDepartments
                },
                deepIncludes: new string[]
                {
                    "EmployeeDepartments.Department"
                }
            )
            .Where(u => u.UserId == userId)
            .FirstOrDefaultAsync();

        if (employee == null || employee.Role?.RoleName == "Admin")
            throw new AppException("Employee not found or insufficient permissions");

        var department = employee.EmployeeDepartments?.FirstOrDefault()?.Department;

        string managerName = "No manager assigned";

        if (department?.ManagerId != null)
        {
            managerName = await _userRepo.GetAll()
                .Where(u => u.UserId == department.ManagerId)
                .Select(u => $"{u.FirstName} {u.LastName}")
                .FirstOrDefaultAsync();
        }

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

            TotalPresentDays = await _attendanceRepo.GetAll()
                .Where(a => a.UserId == userId && a.Status == "Present")
                .CountAsync(),

            TotalAbsentDays = await _attendanceRepo.GetAll()
                .Where(a => a.UserId == userId && a.Status == "Absent")
                .CountAsync(),

            TotalLeaveDays = await _leaveRepo.GetAll()
                .Where(l => l.UserId == userId)
                .SumAsync(l => (int?)(l.EndDate - l.StartDate).TotalDays) ?? 0,

            TotalTasksAssigned = await _taskRepo.GetAll()
                .Where(t => t.UserId == userId)
                .CountAsync(),

            PendingTasks = await _taskRepo.GetAll()
                .Where(t => t.UserId == userId && t.Status == "Pending")
                .CountAsync(),

            CompletedTasks = await _taskRepo.GetAll()
                .Where(t => t.UserId == userId && t.Status == "Completed")
                .CountAsync(),

            LeaveRequests = await _leaveRepo.GetAll()
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedOn)
                .Take(3)
                .Select(l => new LeaveRequestDTO
                {
                    LeaveType = l.LeaveType!,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    Status = l.Status!
                })
                .ToListAsync(),

            Tasks = await _taskRepo.GetAll()
                .Where(t => t.UserId == userId)
                .Select(t => new TaskDTO
                {
                    TaskName = t.TaskName,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    Priority = t.Priority
                })
                .ToListAsync()
        };

        return dashboard;
    }
}

