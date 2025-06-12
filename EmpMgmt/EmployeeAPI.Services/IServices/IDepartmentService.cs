using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices;

public interface IDepartmentService
{
    IEnumerable<Department> GetDepartments();
    Department GetDepartmentById(int id);
}

