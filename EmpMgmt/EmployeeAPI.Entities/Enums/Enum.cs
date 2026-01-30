namespace EmployeeAPI.Entities.Enums;

public class Enum
{
    public enum ProjectRole
    {
        ProjectManager = 1,
        TeamLeader = 2,
        Developer = 3,
        Tester = 4,
        Designer = 5,
    }

    public enum DropDownType
    {
        Role = 1,
        Employee = 2,
        Project = 3
    }

    public enum ProjectStatus
    {
        Pending = 1,
        Planning = 2,
        InProgress = 3,
        Completed = 4,
        OnHold = 5,
    }

    public enum DocumentStatus
    {
        Pending = 1,
        Approved = 2,
        Denied = 3
    }

    public enum LoginStep
    {
        Success = 1,          // Access token issued
        RequireTwoFactor = 2, // OTP verification required
        RequireTwoFactorSetup = 3 // Show QR / setup screen
    }
}
