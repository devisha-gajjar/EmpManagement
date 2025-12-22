using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string Type { get; set; } = null!;

    public int? ReferenceId { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
