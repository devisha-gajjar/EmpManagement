using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;

namespace EmployeeAPI.Services.Implementation;

public class NotificationService(
    IGenericRepository<Notification> notificationRepository,
    IMapper mapper, IHttpContextAccessor httpContextAccessor) : INotificationService
{
    public int UserId => httpContextAccessor.HttpContext?.User?.GetUserId() ?? throw new UnauthorizedAccessException(Constants.UNAUTHORIZED_USER);

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
            CreatedAt = DateTime.Now
        };

        notificationRepository.Add(entity);

        return mapper.Map<NotificationResponseDto>(entity);
    }

    // Mark notification as read
    public async Task<NotificationResponseDto?> MarkAsRead(int notificationId)
    {
        var entity = await notificationRepository.GetByInclude(x => x.NotificationId == notificationId);

        if (entity == null)
            return null;

        entity.IsRead = true;
        entity.ReadAt = DateTime.Now;

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

        if (!notifications.Any())
        {
            throw new AppException(Constants.NOTIFICATION_NOT_FOUND);
        }

        return [.. mapper.ProjectTo<NotificationResponseDto>(notifications)];
    }

    // mark as all read
    public async Task<int> MarkAllAsRead(List<int>? notificationIds = null)
    {
        var query = notificationRepository
            .GetQueryableInclude()
            .Where(x => x.UserId == UserId && !x.IsRead);

        // If notification IDs are passed → select only those
        if (notificationIds != null && notificationIds.Count != 0)
        {
            query = query.Where(x => notificationIds.Contains(x.NotificationId));
        }

        var notifications = query.ToList();

        if (notifications.Count == 0)
            return 0;

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.Now;
        }

        notificationRepository.UpdateRange(notifications);

        return notifications.Count;
    }

}
