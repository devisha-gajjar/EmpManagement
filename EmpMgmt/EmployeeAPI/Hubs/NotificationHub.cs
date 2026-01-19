using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.SignalR;

namespace EmployeeAPI.Hubs;

public class NotificationHub(IProjectMemberService projectMemberService, IGenericRepository<ProjectMember> projectMemberRepository, IUserTaskService userTaskService, INotificationService notificationService) : Hub
{
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine("CONNECTED to HUB");
        Console.WriteLine("ConnectionId: " + Context.ConnectionId);
        Console.WriteLine("user contex" + Context.User.Identity);
        Console.WriteLine("User: " + Context.User?.Identity?.Name);

        await base.OnConnectedAsync();
    }
    public async Task JoinAsAdmin()
    {
        Console.WriteLine("Admin joined hub!");
        await Groups.AddToGroupAsync(Context.ConnectionId, Constants.ADMIN_GROUP);
    }

    public async Task JoinAsUser(string userId)
    {
        Console.WriteLine("user joined hub!");
        await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
    }

    public async Task AddOrUpdateProjectMember(ProjectMemberRequest request)
    {
        Console.WriteLine($"Hub AddOrUpdateProjectMember called with ProjectId={request.ProjectId}");

        bool isEdit = request.ProjectMemberId > 0;

        if (isEdit && !await projectMemberRepository.Exists(x => x.ProjectMemberId == request.ProjectMemberId))
        {
            throw new AppException(Constants.PROJECT_MEM_NOT_FOUND);
        }

        if (!isEdit)
        {
            if (await projectMemberRepository.Exists(x =>
                      x.ProjectId == request.ProjectId &&
                      x.UserId == request.UserId
                  ))
            {
                throw new AppException(Constants.PROJECT_MEM_ALREADY_ASSIGNED_TO_PROJECT);
            }

            if (await projectMemberRepository.Exists(x =>
                x.ProjectId == request.ProjectId &&
                x.UserId == request.UserId &&
                x.Role == (int)request.Role
            ))
            {
                throw new AppException(Constants.PROJECT_MEM_ALREADY_ASSIGNED);
            }
        }

        var result = await projectMemberService.AddOrUpdateMember(request);

        await Clients.Group(Constants.ADMIN_GROUP)
            .SendAsync("ProjectMemberChanged", new
            {
                action = isEdit ? "Updated" : "Added",
                projectId = result.ProjectId,
                userId = result.UserId,
                role = result.Role
            });

        await Clients.Group($"User_{request.UserId}")
            .SendAsync("AssignedToProject", new
            {
                projectId = result.ProjectId,
                role = result.Role,
                action = isEdit ? "Updated" : "Assigned"
            });
    }

    public async Task AddOrUpdateTask(TaskDto dto)
    {
        bool isEdit = dto.TaskId != null && dto.TaskId > 0;

        var result = await userTaskService.UpsertAsync(dto);

        if (dto.UserId.HasValue)
        {
            await Clients.Group($"User_{dto.UserId}")
                .SendAsync("TaskAssigned", new
                {
                    taskId = result.TaskId,
                    taskName = result.TaskName,
                    projectId = result.ProjectId,
                    status = result.Status,
                    priority = result.Priority,
                    action = isEdit ? "Updated" : "Assigned"
                });
        }

        await Clients.Group(Constants.ADMIN_GROUP)
            .SendAsync("TaskChanged", new
            {
                taskId = result.TaskId,
                projectId = result.ProjectId,
                action = isEdit ? "Updated" : "Created"
            });
    }

    public async Task MarkNotificationAsRead(int notificationId)
    {
        // 1️⃣ Call the service to mark as read
        var updatedNotification = await notificationService.MarkAsRead(notificationId);

        if (updatedNotification == null)
        {
            // Optionally, you can send a failure message back to the caller
            await Clients.Caller.SendAsync("NotificationError", $"Notification {notificationId} not found");
            return;
        }

        int userId = updatedNotification.UserId;

        // 2️⃣ Notify user that this specific notification was marked as read
        await Clients.Group($"User_{userId}")
            .SendAsync("NotificationMarkedAsRead", updatedNotification);

        // 3️⃣ Get new unread count and send it
        int unreadCount = await notificationService.GetUnreadCountAsync();
        await Clients.Group($"User_{userId}")
            .SendAsync("UnreadNotificationCountUpdated", unreadCount);
    }

    public async Task MarkAllNotificationsAsRead(List<int>? notificationIds = null)
    {
        int userId = Context.User.GetUserId()
             ?? throw new AppException(Constants.UNAUTHORIZED_USER);

        // 1️⃣ Call service to mark all (or selected) as read
        int markedCount = await notificationService.MarkAllAsRead(notificationIds);

        if (markedCount == 0)
        {
            await Clients.Caller.SendAsync("NotificationError", "No unread notifications found");
            return;
        }

        // 2️⃣ Notify user that notifications were marked as read
        await Clients.Group($"User_{userId}")
            .SendAsync("AllNotificationsMarkedAsRead", new
            {
                notificationIds = notificationIds,
                markedCount
            });

        // 3️⃣ Send updated unread count
        int unreadCount = await notificationService.GetUnreadCountAsync();
        await Clients.Group($"User_{userId}")
            .SendAsync("UnreadNotificationCountUpdated", unreadCount);
    }

}
