using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NotificationController(INotificationService notificationService) : ControllerBase
{
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetNotificationsByUserAsync(int userId)
    {
        var notifications = await notificationService.GetNotificationsByUserAsync(userId);

        return Ok(notifications);
    }
}
