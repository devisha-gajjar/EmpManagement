using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Zipcode { get; set; }

    public string? ProfilePicture { get; set; }

    public int RoleId { get; set; }

    public DateTime CreatedOn { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Role Role { get; set; } = null!;
}
