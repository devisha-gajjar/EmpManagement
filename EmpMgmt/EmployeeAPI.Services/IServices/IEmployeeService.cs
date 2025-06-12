using EmployeeAPI.Entities.DTO;

namespace EmployeeAPI.Services.IServices;

public interface IEmployeeService
{
    IEnumerable<EmployeeListDTO> GetEmployees();
    AddEmployeeViewModelDTO GetEmployeeById(int id);
    bool AddEmployee(AddEmployeeViewModelDTO employeeDto);
    bool UpdateEmployee(int id, AddEmployeeViewModelDTO employeeDto);
    bool DeleteEmployee(int id);
}

