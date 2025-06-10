using EmployeeAPI.Models;
using EmployeeAPI.Models.ViewModels;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Controllers;

[EnableCors("AllowAll")]
[ApiController]
[Route("api/Employee")]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeMgmtContext _db;

    public EmployeeController(EmployeeMgmtContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetEmployeeList()
    {
        var employees = _db.Employees.Include(e => e.Department).Select(e => new EmployeeList
        {
            Id = e.Id,
            Name = e.Name,
            Email = e.Email,
            DepartmentName = e.Department.Name,
            DepartmentId = e.Department.Id
        }).ToList();

        return Ok(employees);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var emp = _db.Employees.Include(e => e.Department).Select(e => new AddEmployeeViewModel
        {
            Id = e.Id,
            Name = e.Name,
            Email = e.Email,
            DepartmentId = e.Department.Id
        }).FirstOrDefault(e => e.Id == id);

        return emp == null ? NotFound() : Ok(emp);
    }

    [HttpPost]
    public IActionResult AddEmployee(AddEmployeeViewModel employeeList)
    {
        bool existingEmployee = _db.Employees.Any(e => e.Name == employeeList.Name || e.Email == employeeList.Email);

        if (existingEmployee)
        {
            return BadRequest("Employee Already Exist!!");
        }

        Employee emp = new()
        {
            Name = employeeList.Name,
            Email = employeeList.Email,
            DepartmentId = employeeList.DepartmentId
        };

        _db.Employees.Add(emp);
        _db.SaveChanges();
        return CreatedAtAction(nameof(GetById), new { id = emp.Id }, emp);
    }

    [HttpPut("{id}")]
    public IActionResult EditEmployee(int id, [FromBody] AddEmployeeViewModel emp)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != emp.Id)
        {
            return BadRequest();
        }

        var existing = _db.Employees.Find(id);

        if (existing == null)
            return NotFound();

        if (emp.Email != existing.Email)
        {
            bool duplicateEmployee = _db.Employees.Any(e => e.Email == emp.Email);
            if (duplicateEmployee)
            {
                return BadRequest("Can't use this Email address!!");
            }
        }

        existing.Name = emp.Name;
        existing.Email = emp.Email;
        existing.DepartmentId = emp.DepartmentId;

        _db.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var emp = _db.Employees.Find(id);
        if (emp == null)
            return NotFound();

        _db.Employees.Remove(emp);
        _db.SaveChanges();
        return NoContent();
    }
}
