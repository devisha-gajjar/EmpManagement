using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;

namespace EmployeeAPI.Services.Implementation;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departemntRepository;

    public DepartmentService(IDepartmentRepository departemntRepository)
    {
        _departemntRepository = departemntRepository;
    }

    public IEnumerable<Department> GetDepartments()
    {
        return _departemntRepository.GetAll();
    }

    public Department GetDepartmentById(int id)
    {
        return _departemntRepository.GetById(id);
    }
}
