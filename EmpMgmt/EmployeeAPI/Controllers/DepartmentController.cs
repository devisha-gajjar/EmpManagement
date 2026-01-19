using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/Department")]
[Authorize(Roles = "Admin")]
public class DepartmentController(IDepartmentService service) : ControllerBase
{
    private readonly IDepartmentService _service = service;

    [HttpGet]
    public IActionResult GetDepartments()
    {
        return Ok(_service.GetDepartments());
    }


}