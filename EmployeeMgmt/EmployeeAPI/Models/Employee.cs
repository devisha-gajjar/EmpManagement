using System;
using System.Collections.Generic;

namespace EmployeeAPI.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Email { get; set; }

    public int DepartmentId { get; set; }

    public virtual Department Department { get; set; } = null!;
}
