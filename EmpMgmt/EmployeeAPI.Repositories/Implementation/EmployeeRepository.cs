using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.Implementation;
using EmployeeAPI.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Repositories.Repositories;

public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
{

    private readonly EmployeeMgmtContext _db;

    public EmployeeRepository(EmployeeMgmtContext db) : base(db)
    {
        _db = db;
    }

    public bool EmployeeExistsByEmail(string email)
    {
        return _db.Employees.Any(e => e.Email == email);
    }

    public Employee? GetEmployeeWithDepartmentById(int id)
    {
        return _db.Employees
            .Include(e => e.Department)
            .FirstOrDefault(e => e.Id == id);
    }

    public IEnumerable<Employee> GetEmployeesWithDepartments()
    {
        return _db.Employees.Include(e => e.Department).ToList();
    }


}
