using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class ProjectMember
{
    public int ProjectMemberId { get; set; }

    public int ProjectId { get; set; }

    public int UserId { get; set; }

    public DateTime? AddedOn { get; set; }

    public int Role { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
