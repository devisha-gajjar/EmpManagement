namespace EmployeeAPI.Entities.Helper;

public static class Constants
{
    #region Common Msg
    public const string UNAUTHORIZED_USER = "User is not authorized.";
    public const string ADMIN_GROUP = "Admins";
    public const string BEARER = "Bearer";
    #endregion

    #region Entity Field Names
    public const string IS_DELETED = "IsDeleted";
    public const string ID = "Id";
    #endregion

    #region Linq Function Names
    public const string WHERE = "Where";
    public const string ORDER_BY = "OrderBy";
    #endregion

    #region CRUD Messages
    public const string FETCH_SUCCESS = "Data fetched successfully";
    public const string CREATE_SUCCESS = "Created successfully";
    public const string UPDATE_SUCCESS = "Updated successfully";
    public const string DELETE_SUCCESS = "Deleted successfully";
    #endregion

    #region Project Mgmt
    public const string PROJECT_NOT_FOUND = "Project not found.";
    public const string PROJECT_MEM_NOT_FOUND = "Project member not found.";
    public const string PROJECT_MEM_ALREADY_ASSIGNED = "Project member is alredy exist with same role";
    public const string PROJECT_MEM_ALREADY_ASSIGNED_TO_PROJECT = "Project member is assigned already to one role";
    #endregion

    #region Notifications
    public const string NOTIFICATION_NOT_FOUND = "No notifications found for the specified user.";
    #endregion

    #region Task Mgmt
    public const string TASK_NOT_FOUND = "Task not found.";
    public const string TASK_CREATED = "Task created successfully.";
    public const string TASK_UPDATED = "Task updated successfully.";
    public const string TASK_DELETED = "Task deleted successfully.";
    #endregion
}