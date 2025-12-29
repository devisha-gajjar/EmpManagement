using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices;

public interface IEmployeeService
{
    IEnumerable<EmployeeListDto> GetEmployees();
    AddEmployeeViewModelDto GetEmployeeById(int id);
    Employee? AddEmployee(AddEmployeeViewModelDto employeeDto);
    bool UpdateEmployee(int id, AddEmployeeViewModelDto employeeDto);
    bool DeleteEmployee(int id);
}

