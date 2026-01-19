using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User")]
public class NotificationController(INotificationService notificationService) : ControllerBase
{
    private readonly INotificationService _notificationService = notificationService;

    [HttpGet("navbar")]
    public async Task<IActionResult> GetNavbarNotifications()
    {
        var result = await _notificationService.GetNavbarNotificationsAsync();
        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var count = await _notificationService.GetUnreadCountAsync();
        return Ok(count);
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetNotificationsByUserAsync()
    {
        var notifications = await notificationService.GetNotificationsByUserAsync();

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

    [HttpDelete("{notificationId}")]
    public async Task<IActionResult> Delete(int notificationId)
    {
        var deleted = await _notificationService.DeleteNotificationAsync(notificationId);
        return deleted ? Ok() : NotFound();
    }
}
