using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface INotificationService
{
    Task<NotificationResponseDto> AddNotificationAsync(NotificationRequestDto request);
    Task<NotificationResponseDto?> MarkAsReadAsync(int notificationId);
    Task<List<NotificationResponseDto>> GetNotificationsByUserAsync(int userId);
}
