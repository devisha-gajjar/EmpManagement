using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices;

public interface IEmployeeService
{
    IEnumerable<EmployeeListDTO> GetEmployees();
    AddEmployeeViewModelDTO GetEmployeeById(int id);
    Employee? AddEmployee(AddEmployeeViewModelDTO employeeDto);
    bool UpdateEmployee(int id, AddEmployeeViewModelDTO employeeDto);
    bool DeleteEmployee(int id);
}

