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

    public DateTime? EmploymentStartDate { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? Position { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<Department> Departments { get; set; } = new List<Department>();

    public virtual ICollection<EmployeeDepartment> EmployeeDepartments { get; set; } = new List<EmployeeDepartment>();

    public virtual ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<PerformanceReview> PerformanceReviewReviewedByNavigations { get; set; } = new List<PerformanceReview>();

    public virtual ICollection<PerformanceReview> PerformanceReviewUsers { get; set; } = new List<PerformanceReview>();

    public virtual ICollection<Project> ProjectCreatedByNavigations { get; set; } = new List<Project>();

    public virtual ICollection<ProjectMember> ProjectMembers { get; set; } = new List<ProjectMember>();

    public virtual ICollection<Project> ProjectModifiedByNavigations { get; set; } = new List<Project>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<TaskActivityLog> TaskActivityLogs { get; set; } = new List<TaskActivityLog>();

    public virtual ICollection<TaskAttachment> TaskAttachments { get; set; } = new List<TaskAttachment>();

    public virtual ICollection<TaskComment> TaskComments { get; set; } = new List<TaskComment>();

    public virtual ICollection<TaskWorkLog> TaskWorkLogs { get; set; } = new List<TaskWorkLog>();

    public virtual ICollection<UserTask> UserTaskAssignedByNavigations { get; set; } = new List<UserTask>();

    public virtual ICollection<UserTask> UserTaskUsers { get; set; } = new List<UserTask>();
}
