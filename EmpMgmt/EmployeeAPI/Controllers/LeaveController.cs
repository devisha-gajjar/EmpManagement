
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Authorize(Roles = "Admin, User")]
public class LeaveController : ControllerBase
{
    private readonly ILeaveService _leaveService;

    public LeaveController(ILeaveService leaveService)
    {
        _leaveService = leaveService;
    }

    [HttpGet("GetLeaveList")]
    public IActionResult GetLeaveList()
    {
        var leaves = _leaveService.GetLeaveList();
        return Ok(leaves);
    }

    [HttpGet("GetUserLeaveHistory")]
    public IActionResult GetUserLeaveHistory()
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.Name)?.Value!);
        var leaves = _leaveService.GetUserLeaveHistory(userId);
        return Ok(leaves);
    }

    [HttpPost("ApplyLeave")]
    public async Task<IActionResult> ApplyLeave([FromBody] CreateLeaveRequestDto model)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.Name)?.Value!);
        model.UserId = userId;
        var leave = await _leaveService.ApplyLeaveAsync(model);
        return Ok(leave);
    }

    // PUT: api/Leave/Approve/5
    [HttpPut("Approve/{leaveRequestId}")]
    public async Task<IActionResult> ApproveLeave(int leaveRequestId)
    {
        var result = await _leaveService.ApproveLeaveAsync(leaveRequestId);
        if (!result) return NotFound();
        return Ok(new { message = "Leave approved successfully." });
    }

    // PUT: api/Leave/Deny/5
    [HttpPut("Deny/{leaveRequestId}")]
    public async Task<IActionResult> DenyLeave(int leaveRequestId)
    {
        var result = await _leaveService.DenyLeaveAsync(leaveRequestId);
        if (!result) return NotFound();
        return Ok(new { message = "Leave denied successfully." });
    }

    [HttpGet("{leaveRequestId}")]
    public async Task<IActionResult> GetLeave(int leaveRequestId)
    {
        var result = await _leaveService.GetLeaveWithUser(leaveRequestId);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _leaveService.DeleteLeave(id))
            return NotFound();

        return NoContent();
    }
}

