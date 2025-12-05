using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class LeaveRequest
{
    public int LeaveRequestId { get; set; }

    public int? UserId { get; set; }

    public string? LeaveType { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedOn { get; set; }

    public string Reason { get; set; } = null!;

    public virtual User? User { get; set; }
}
