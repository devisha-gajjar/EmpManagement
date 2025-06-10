using EmployeeAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Controllers;

[EnableCors("AllowAll")]
[ApiController]
[Route("api/Department")]
public class DepartmentController : ControllerBase
{
    private readonly EmployeeMgmtContext _db;

    public DepartmentController(EmployeeMgmtContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetEmployeeList() =>
        Ok(_db.Departments.ToList());

}