using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User")]
public class NotificationController(INotificationService notificationService) : ControllerBase
{
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetNotificationsByUserAsync(int userId)
    {
        var notifications = await notificationService.GetNotificationsByUserAsync(userId);

        return Ok(notifications);
    }

    [HttpPut("{notificationId}/read")]
    public async Task<IActionResult> MarkAsRead(int notificationId)
    {
        var result = await notificationService.MarkAsRead(notificationId);

        if (result == null)
            return NotFound(new { message = "Notification not found" });

        return Ok(result);
    }

    [HttpPut("read")]
    public async Task<IActionResult> MarkAllAsRead([FromBody] List<int>? notificationIds)
    {
        var count = await notificationService.MarkAllAsRead(notificationIds);

        return Ok(new
        {
            markedCount = count,
            message = count == 0
                ? "No unread notifications found"
                : $"{count} notifications marked as read"
        });
    }
}
