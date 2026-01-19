using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface INotificationService
{
    Task<NotificationResponseDto> AddNotificationAsync(NotificationRequestDto request);
    Task<NotificationResponseDto?> MarkAsRead(int notificationId);
    Task<List<NotificationResponseDto>> GetNotificationsByUserAsync();
    Task<int> MarkAllAsRead(List<int>? notificationIds = null);
    Task<int> GetUnreadCountAsync();
    Task<bool> DeleteNotificationAsync(int notificationId);
    Task<List<NotificationResponseDto>> GetNavbarNotificationsAsync(int take = 5);
}
