using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class TaskActivityLog
{
    public int ActivityId { get; set; }

    public int? TaskId { get; set; }

    public int? UserId { get; set; }

    public string Action { get; set; } = null!;

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual UserTask? Task { get; set; }

    public virtual User? User { get; set; }
}
