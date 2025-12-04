using System;
using System.Collections.Generic;
using EmployeeAPI.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Entities.Data;

public partial class EmployeeMgmtContext : DbContext
{
    public EmployeeMgmtContext()
    {
    }

    public EmployeeMgmtContext(DbContextOptions<EmployeeMgmtContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Attendance> Attendances { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<EmployeeDepartment> EmployeeDepartments { get; set; }

    public virtual DbSet<LeaveRequest> LeaveRequests { get; set; }

    public virtual DbSet<PerformanceReview> PerformanceReviews { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserTask> UserTasks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => e.AttendanceId).HasName("attendance_pkey");

            entity.ToTable("attendance");

            entity.Property(e => e.AttendanceId).HasColumnName("attendance_id");
            entity.Property(e => e.ClockIn)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("clock_in");
            entity.Property(e => e.ClockOut)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("clock_out");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.Date)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Present'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Attendances)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("attendance_user_id_fkey");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("departments_pkey");

            entity.ToTable("departments");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ManagerId).HasColumnName("manager_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.HasOne(d => d.Manager).WithMany(p => p.Departments)
                .HasForeignKey(d => d.ManagerId)
                .HasConstraintName("departments_manager_id_fkey");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("employees_pkey");

            entity.ToTable("employees");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdOn");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Salary).HasColumnName("salary");

            entity.HasOne(d => d.Department).WithMany(p => p.Employees)
                .HasForeignKey(d => d.DepartmentId)
                .HasConstraintName("fk_department");
        });

        modelBuilder.Entity<EmployeeDepartment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("employee_departments_pkey");

            entity.ToTable("employee_departments");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Current)
                .HasDefaultValueSql("true")
                .HasColumnName("current");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.EndDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("end_date");
            entity.Property(e => e.StartDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("start_date");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Department).WithMany(p => p.EmployeeDepartments)
                .HasForeignKey(d => d.DepartmentId)
                .HasConstraintName("employee_departments_department_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.EmployeeDepartments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("employee_departments_user_id_fkey");
        });

        modelBuilder.Entity<LeaveRequest>(entity =>
        {
            entity.HasKey(e => e.LeaveRequestId).HasName("leave_requests_pkey");

            entity.ToTable("leave_requests");

            entity.Property(e => e.LeaveRequestId).HasColumnName("leave_request_id");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.EndDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("end_date");
            entity.Property(e => e.LeaveType)
                .HasMaxLength(50)
                .HasColumnName("leave_type");
            entity.Property(e => e.StartDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Pending'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.LeaveRequests)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("leave_requests_user_id_fkey");
        });

        modelBuilder.Entity<PerformanceReview>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("performance_reviews_pkey");

            entity.ToTable("performance_reviews");

            entity.Property(e => e.ReviewId).HasColumnName("review_id");
            entity.Property(e => e.Comments).HasColumnName("comments");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.ReviewDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("review_date");
            entity.Property(e => e.ReviewedBy).HasColumnName("reviewed_by");
            entity.Property(e => e.Score).HasColumnName("score");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.ReviewedByNavigation).WithMany(p => p.PerformanceReviewReviewedByNavigations)
                .HasForeignKey(d => d.ReviewedBy)
                .HasConstraintName("performance_reviews_reviewed_by_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.PerformanceReviewUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("performance_reviews_user_id_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("roles_pkey");

            entity.ToTable("roles");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(255)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.HasIndex(e => e.Username, "users_username_key").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.DateOfBirth)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.EmploymentStartDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("employment_start_date");
            entity.Property(e => e.FirstName)
                .HasMaxLength(255)
                .HasColumnName("first_name");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
            entity.Property(e => e.LastName)
                .HasMaxLength(255)
                .HasColumnName("last_name");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .HasColumnName("phone");
            entity.Property(e => e.Position)
                .HasMaxLength(100)
                .HasColumnName("position");
            entity.Property(e => e.ProfilePicture)
                .HasColumnType("character varying")
                .HasColumnName("profile_picture");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasColumnName("username");
            entity.Property(e => e.Zipcode)
                .HasMaxLength(15)
                .HasColumnName("zipcode");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_role");
        });

        modelBuilder.Entity<UserTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("tasks_pkey");

            entity.ToTable("user_task");

            entity.Property(e => e.TaskId)
                .HasDefaultValueSql("nextval('tasks_task_id_seq'::regclass)")
                .HasColumnName("task_id");
            entity.Property(e => e.AssignedBy).HasColumnName("assigned_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.DueDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("due_date");
            entity.Property(e => e.Priority)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Medium'::character varying")
                .HasColumnName("priority");
            entity.Property(e => e.StartDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Pending'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.TaskName)
                .HasMaxLength(255)
                .HasColumnName("task_name");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.AssignedByNavigation).WithMany(p => p.UserTaskAssignedByNavigations)
                .HasForeignKey(d => d.AssignedBy)
                .HasConstraintName("tasks_assigned_by_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.UserTaskUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("tasks_user_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
