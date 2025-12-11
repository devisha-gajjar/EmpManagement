using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class TaskComment
{
    public int CommentId { get; set; }

    public int? TaskId { get; set; }

    public int? UserId { get; set; }

    public string Comment { get; set; } = null!;

    public DateTime? CreatedOn { get; set; }

    public virtual UserTask? Task { get; set; }

    public virtual User? User { get; set; }
}
