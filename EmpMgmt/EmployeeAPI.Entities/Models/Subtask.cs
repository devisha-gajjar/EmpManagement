using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class Subtask
{
    public int SubtaskId { get; set; }

    public int? TaskId { get; set; }

    public string Title { get; set; } = null!;

    public string? Status { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual UserTask? Task { get; set; }
}
