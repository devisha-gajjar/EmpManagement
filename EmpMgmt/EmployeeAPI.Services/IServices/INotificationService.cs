using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface INotificationService
{
    Task<NotificationResponseDto> AddNotificationAsync(NotificationRequestDto request);
    Task<NotificationResponseDto?> MarkAsRead(int notificationId);
    Task<List<NotificationResponseDto>> GetNotificationsByUserAsync(int userId);
    Task<int> MarkAllAsRead(List<int>? notificationIds = null);
    Task<int> GetUnreadCountAsync(int userId);
    Task<bool> DeleteNotificationAsync(int notificationId);
}
