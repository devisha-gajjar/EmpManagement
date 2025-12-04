using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class Department
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? ManagerId { get; set; }

    public virtual ICollection<EmployeeDepartment> EmployeeDepartments { get; set; } = new List<EmployeeDepartment>();

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual User? Manager { get; set; }
}
