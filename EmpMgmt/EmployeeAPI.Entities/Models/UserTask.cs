using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class UserTask
{
    public int TaskId { get; set; }

    public int? UserId { get; set; }

    public string TaskName { get; set; } = null!;

    public string? Description { get; set; }

    public int? AssignedBy { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime DueDate { get; set; }

    public string? Priority { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual User? AssignedByNavigation { get; set; }

    public virtual User? User { get; set; }
}
