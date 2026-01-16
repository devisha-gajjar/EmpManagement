using AutoMapper;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace EmployeeAPI.Services.Implementation;

public class NotificationService(
    IGenericRepository<Notification> notificationRepository,
    IMapper mapper, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IConfiguration config, IGenericRepository<User> userRepository) : INotificationService
{
    public int UserId => httpContextAccessor.HttpContext?.User?.GetUserId() ?? throw new UnauthorizedAccessException(Constants.UNAUTHORIZED_USER);

    #region Add notification
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

        User user = userRepository.GetById(request.UserId)!;

        string actionUrl = $"{config["Frontend:BaseUrl"]}user/notification";

        var mailDto = new NotificationMailDto
        {
            Email = user.Email,
            UserName = user.Username,
            NotificationTitle = request.Title,
            NotificationMessage = request.Message,
            ActionUrl = actionUrl
        };

        var emailSent = await SendMailToUser(mailDto);

        var response = mapper.Map<NotificationResponseDto>(entity);
        response.EmailSent = emailSent;

        return response;
    }
    #endregion

    #region Mark notification as read
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
    #endregion

    #region Get notifications by user
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
    #endregion

    #region Mark as all read
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
    #endregion

    #region Send mail
    private async Task<string> SendMailToUser(NotificationMailDto notificationMailDto)
    {
        string? templatePath = config["EmailSettings:NewUserTemplatePath"];
        if (string.IsNullOrWhiteSpace(templatePath))
            throw new AppException(Constants.EMAIL_PATH_NOT_CONFIGURED);

        string fullPath = Path.Combine(Directory.GetCurrentDirectory(), templatePath);
        Console.WriteLine("Path : " + fullPath);
        string emailBody = await File.ReadAllTextAsync(fullPath);

        emailBody = emailBody
            .Replace("{UserName}", notificationMailDto.UserName)
            .Replace("{NotificationTitle}", notificationMailDto.NotificationTitle)
            .Replace("{NotificationMessage}", notificationMailDto.NotificationMessage)
            .Replace("{ActionUrl}", notificationMailDto.ActionUrl)
            .Replace("{Year}", DateTime.Now.Year.ToString());

        bool isEmailSent = await emailService.SendEmailAsync(new EmailRequestDto
        {
            To = notificationMailDto.Email,
            Subject = "Notification Received",
            Body = emailBody
        });

        return isEmailSent
            ? string.Format(Constants.EMAIL_SENT_SUCCESS, notificationMailDto.Email)
            : Constants.EMAIL_NOT_SENT;
    }
    #endregion

    #region Unread Notification Count
    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await Task.FromResult(
            notificationRepository
                .GetAll()
                .Count(n => n.UserId == userId && !n.IsRead)
        );
    }
    #endregion

    #region Delete Notification
    public async Task<bool> DeleteNotificationAsync(int notificationId)
    {
        var notification = await notificationRepository.GetByInclude(
            x => x.NotificationId == notificationId && x.UserId == UserId
        );

        if (notification == null)
            return false;

        notificationRepository.Delete(notification);

        return true;
    }
    #endregion
}
