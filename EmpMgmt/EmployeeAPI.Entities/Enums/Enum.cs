namespace EmployeeAPI.Entities.Enums;

public class Enum
{
    public enum ProjectRole
    {
        Owner = 1,
        Manager = 2,
        Developer = 3,
        QA = 4,
        Member = 5
    }

    public enum DropDownType
    {
        Role = 1,
    }

    public enum ProjectStatus
    {
        Pending = 1,
        Planning = 2,
        InProgress = 3,
        Completed = 4,
        OnHold = 5,
    }
}
