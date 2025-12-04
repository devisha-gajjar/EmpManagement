using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("dashboard/{userId}")]
    public async Task<ActionResult<EmployeeDashboardDTO>> GetEmployeeDashboard(int userId)
    {
        var dashboard = await _dashboardService.GetEmployeeDashboardAsync(userId);

        return Ok(dashboard);
    }
}
