using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class PerformanceReview
{
    public int ReviewId { get; set; }

    public int? UserId { get; set; }

    public int? ReviewedBy { get; set; }

    public DateTime ReviewDate { get; set; }

    public int? Score { get; set; }

    public string? Comments { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual User? ReviewedByNavigation { get; set; }

    public virtual User? User { get; set; }
}
