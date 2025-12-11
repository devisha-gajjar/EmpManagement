using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class TaskTag
{
    public int TagId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<UserTask> Tasks { get; set; } = new List<UserTask>();
}
