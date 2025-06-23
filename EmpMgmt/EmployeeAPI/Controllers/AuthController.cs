using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using EmployeeAPI.Entities.Data;

namespace EmployeeAPI.Controllers;

[EnableCors("AllowAll")]
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    private readonly EmployeeMgmtContext _db;
    private readonly ICustomService _customService;

    public AuthController(IAuthService authService, EmployeeMgmtContext db, ICustomService customService)
    {
        _authService = authService;
        _db = db;
        _customService = customService;
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



    [HttpPost("google-login")]
    public IActionResult GoogleLogin([FromBody] GoogleLoginDTO dto)
    {
        GoogleJsonWebSignature.Payload payload;

        try
        {
            // Blocking call instead of async/await
            payload = GoogleJsonWebSignature.ValidateAsync(dto.IdToken).Result;
        }
        catch
        {
            return BadRequest("Invalid Google token.");
        }

        var user = _db.Users.FirstOrDefault(u => u.Email == payload.Email && !u.IsDeleted);
        if (user == null)
        {
            user = new User
            {
                Email = payload.Email,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Username = payload.Email, // or generate unique username
                Password = "", // no password for Google login
                RoleId = 2, // default role id
                CreatedOn = DateTime.Now,
                IsDeleted = false,
                ProfilePicture = payload.Picture
            };

            _db.Users.Add(user);
            _db.SaveChanges();
        }

        var token = _customService.GenerateJwtToken(user.Username);

        return Ok(new { Token = token });
    }
}

