using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;

namespace EmployeeAPI.Services.Implementation;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _empRepository;

    public EmployeeService(IEmployeeRepository empRepository)
    {
        _empRepository = empRepository;
    }

    public IEnumerable<EmployeeListDTO> GetEmployees()
    {
        var employees = _empRepository.GetEmployeesWithDepartments();
        return employees.OrderBy(e => e.Id).Select(e => new EmployeeListDTO
        {
            Id = e.Id,
            Name = e.Name,
            Email = e.Email,
            DepartmentName = e.Department?.Name,
            DepartmentId = e.DepartmentId,
            Salary = e.Salary,
            CreatedOn = e.CreatedOn
        });
    }

    public AddEmployeeViewModelDTO GetEmployeeById(int id)
    {
        var emp = _empRepository.GetEmployeeWithDepartmentById(id);
        if (emp == null)
            return null;

        return new AddEmployeeViewModelDTO
        {
            Id = emp.Id,
            Name = emp.Name,
            Email = emp.Email,
            DepartmentId = emp.DepartmentId
        };
    }

    public Employee? AddEmployee(AddEmployeeViewModelDTO employeeDto)
    {
        if (_empRepository.EmployeeExistsByEmail(employeeDto.Email))
            return null;

        var emp = new Employee
        {
            Name = employeeDto.Name,
            Email = employeeDto.Email,
            DepartmentId = employeeDto.DepartmentId,
            Salary = employeeDto.Salary,
            CreatedOn = DateTime.Now
        };

        _empRepository.Add(emp);
        return _empRepository.GetById(emp.Id);
    }

    public bool UpdateEmployee(int id, AddEmployeeViewModelDTO employeeDto)
    {
        if (id != employeeDto.Id)
            return false;

        var existing = _empRepository.GetById(id);
        if (existing == null)
            return false;

        if (existing.Email != employeeDto.Email && _empRepository.EmployeeExistsByEmail(employeeDto.Email))
            return false;

        existing.Name = employeeDto.Name;
        existing.Email = employeeDto.Email;
        existing.DepartmentId = employeeDto.DepartmentId;
        existing.Salary = employeeDto.Salary;

        _empRepository.Update(existing);
        return true;
    }

    public bool DeleteEmployee(int id)
    {
        var emp = _empRepository.GetById(id);
        if (emp == null)
            return false;

        _empRepository.Delete(emp);
        return true;
    }
}
