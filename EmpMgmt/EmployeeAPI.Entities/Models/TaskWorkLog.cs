using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class TaskWorkLog
{
    public int WorkLogId { get; set; }

    public int TaskId { get; set; }

    public int UserId { get; set; }

    public DateTime LogDate { get; set; }

    public decimal HoursSpent { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public virtual UserTask Task { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
