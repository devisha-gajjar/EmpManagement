using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class EmployeeDepartment
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? DepartmentId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool? Current { get; set; }

    public virtual Department? Department { get; set; }

    public virtual User? User { get; set; }
}
