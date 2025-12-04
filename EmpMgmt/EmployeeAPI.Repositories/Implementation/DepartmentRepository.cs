using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;

namespace EmployeeAPI.Repositories.Implementation;

public class DepartmentRepository : GenericRepository<Department>, IDepartmentRepository
{
    public DepartmentRepository(EmployeeMgmtContext context) : base(context)
    {
    }

}
