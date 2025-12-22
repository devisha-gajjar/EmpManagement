using AutoMapper;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;

namespace EmployeeAPI.Services.Implementation;

public class NotificationService(
    IGenericRepository<Notification> notificationRepository,
    IMapper mapper) : INotificationService
{
    public async Task<NotificationResponseDto> AddNotificationAsync(NotificationRequestDto request)
    {
        var entity = new Notification
        {
            UserId = request.UserId,
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            ReferenceId = request.ReferenceId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        notificationRepository.Add(entity);

        return mapper.Map<NotificationResponseDto>(entity);
    }

    // Mark notification as read
    public async Task<NotificationResponseDto?> MarkAsReadAsync(int notificationId)
    {
        var entity = await notificationRepository.GetByInclude(x => x.NotificationId == notificationId);

        if (entity == null)
            return null;

        entity.IsRead = true;
        entity.ReadAt = DateTime.UtcNow;

        notificationRepository.Update(entity);

        return mapper.Map<NotificationResponseDto>(entity);
    }

    // Get notifications by user
    public async Task<List<NotificationResponseDto>> GetNotificationsByUserAsync(int userId)
    {
        var notifications = notificationRepository
            .GetQueryableInclude()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt);

        return [.. mapper.ProjectTo<NotificationResponseDto>(notifications)];
    }
}
