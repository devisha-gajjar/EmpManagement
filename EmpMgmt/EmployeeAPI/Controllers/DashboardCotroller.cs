using System.Security.Claims;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[Route("api/user")]
[ApiController]
[Authorize(Roles = "User")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<EmployeeDashboardDTO>> GetEmployeeDashboard()
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.Name)?.Value!);
        var dashboard = await _dashboardService.GetEmployeeDashboardAsync(userId);

        return Ok(dashboard);
    }
}
