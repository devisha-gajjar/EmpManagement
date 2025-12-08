using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;

namespace EmployeeAPI.Controllers
{
    [EnableCors("AllowAll")]
    [ApiController]
    [Route("api/Employee")]
    [Authorize(Roles = "Admin")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeeController(IEmployeeService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetEmployeeList()
        {
            var employees = _service.GetEmployees();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var emp = _service.GetEmployeeById(id) ?? throw new AppException($"User with ID this {id} not found.", 404);
            return Ok(emp);
        }

        [HttpPost]
        public IActionResult AddEmployee([FromBody] AddEmployeeViewModelDTO employeeDto)
        {
            var createdEmployee = _service.AddEmployee(employeeDto) ?? throw new AppException("Employee Already Exists!!");

            return CreatedAtAction(nameof(GetById), new { id = createdEmployee.Id }, createdEmployee);
        }


        [HttpPut("{id}")]
        public IActionResult EditEmployee(int id, AddEmployeeViewModelDTO employeeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_service.UpdateEmployee(id, employeeDto))
                throw new AppException("Update failed: invalid data or duplicate email!!");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_service.DeleteEmployee(id))
                return NotFound();

            return NoContent();
        }
    }
}
