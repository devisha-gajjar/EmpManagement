using Microsoft.AspNetCore.SignalR;
using EmployeeAPI.Services.IServices;
using EmployeeAPI.Entities.DTO;

namespace EmployeeAPI.Hubs;
public class LeaveHub : Hub
{
    private readonly ILeaveService _leaveService;

    public LeaveHub(ILeaveService leaveService)
    {
        _leaveService = leaveService;
    }

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

    public async Task ApplyLeave(CreateLeaveRequestDto model)
    {
        var leave = await _leaveService.ApplyLeaveAsync(model);

        Console.WriteLine("NewLeaveRequest");

        // Notify all admins
        await Clients.Group("Admins")
            .SendAsync("NewLeaveRequest", new
            {
                leave.LeaveRequestId,
                leave.UserId,
                leave.LeaveType,
                leave.Status,
                leave.Reason
            });
    }

    public async Task ApproveLeave(string leaveRequestId, string userId)
    {
        Console.WriteLine("Approve req" + userId);

        int id = int.Parse(leaveRequestId);
        int uid = int.Parse(userId);

        var updated = await _leaveService.ApproveLeaveAsync(id);
        if (!updated) return;

        await Clients.Group($"User_{uid}")
            .SendAsync("LeaveStatusChanged", new
            {
                leaveRequestId = id,
                status = "Approved"
            });
        await Clients.Group("Admins")
            .SendAsync("LeaveStatusChanged", new
            {
                leaveRequestId = id,
                status = "Approved"
            });
    }

    public async Task DenyLeave(string leaveRequestId, string userId)
    {
        int id = int.Parse(leaveRequestId);
        int uid = int.Parse(userId);

        var updated = await _leaveService.DenyLeaveAsync(id);
        if (!updated) return;

        await Clients.Group($"User_{uid}")
            .SendAsync("LeaveStatusChanged", new
            {
                leaveRequestId,
                status = "Denied"
            });

        await Clients.Group("Admins")
       .SendAsync("LeaveStatusChanged", new
       {    
           leaveRequestId = id,
           status = "Denied"
       });
    }
}
