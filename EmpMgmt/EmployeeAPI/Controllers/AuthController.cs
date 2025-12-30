using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using EmployeeAPI.Entities.Data;
using System.Text.Json;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Controllers;

[EnableCors("AllowAll")]
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService, EmployeeMgmtContext db, ICustomService customService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    private readonly EmployeeMgmtContext _db = db;
    private readonly ICustomService _customService = customService;

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto dto)
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
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var token = _authService.Login(dto.UsernameOrEmail, dto.Password);
        if (token == null)
            return Unauthorized("Invalid username/email or password.");

        return Ok(new { Token = token });
    }



   namespace EmployeeAPI.Entities.DTO.RequestDto;

public class GoogleLoginDto
{
    public string IdToken { get; set; } = null!;
}



}

