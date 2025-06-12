using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[EnableCors("AllowAll")]
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDTO dto)
    {
        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            Zipcode = dto.Zipcode,
            RoleId = dto.RoleId,
            CreatedOn = DateTime.Now
        };

        var registeredUser = _authService.Register(user, dto.Password);
        if (registeredUser == null)
            return BadRequest("User with this email or username already exists.");

        return Ok(new { Message = "Registration successful" });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO dto)
    {
        var token = _authService.Login(dto.UsernameOrEmail, dto.Password);
        if (token == null)
            return Unauthorized("Invalid username/email or password.");

        return Ok(new { Token = token });
    }
}

