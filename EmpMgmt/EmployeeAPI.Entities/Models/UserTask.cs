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

    public decimal? EstimatedHours { get; set; }

    public decimal? SpentHours { get; set; }

    public DateTime? CompletedOn { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public int? ProjectId { get; set; }

    public virtual User? AssignedByNavigation { get; set; }

    public virtual Project? Project { get; set; }

    public virtual ICollection<Subtask> Subtasks { get; set; } = new List<Subtask>();

    public virtual ICollection<TaskActivityLog> TaskActivityLogs { get; set; } = new List<TaskActivityLog>();

    public virtual ICollection<TaskAttachment> TaskAttachments { get; set; } = new List<TaskAttachment>();

    public virtual ICollection<TaskComment> TaskComments { get; set; } = new List<TaskComment>();

    public virtual ICollection<TaskWorkLog> TaskWorkLogs { get; set; } = new List<TaskWorkLog>();

    public virtual User? User { get; set; }

    public virtual ICollection<TaskTag> Tags { get; set; } = new List<TaskTag>();
}
