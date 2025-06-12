using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Repositories.IRepositories;

public interface IEmployeeRepository : IGenericRepository<Employee>
{
    bool EmployeeExistsByEmail(string email);
    Employee? GetEmployeeWithDepartmentById(int id);
    IEnumerable<Employee> GetEmployeesWithDepartments();
}
