using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class Attendance
{
    public int AttendanceId { get; set; }

    public int? UserId { get; set; }

    public DateTime ClockIn { get; set; }

    public DateTime? ClockOut { get; set; }

    public DateTime Date { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual User? User { get; set; }
}
