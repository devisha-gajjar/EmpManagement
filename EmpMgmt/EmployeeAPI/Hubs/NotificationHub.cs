using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.SignalR;

namespace EmployeeAPI.Hubs;

public class NotificationHub(IProjectMemberService projectMemberService) : Hub
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
        await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
    }

    public async Task JoinAsUser(string userId)
    {
        Console.WriteLine("user joined hub!");
        await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
    }

    public async Task AddOrUpdateProjectMember(ProjectMemberRequest request)
    {
        var result = await projectMemberService.AddOrUpdateMember(request);

        bool isEdit = request.ProjectMemberId > 0;

        await Clients.Group("Admins")
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

}
