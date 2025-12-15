namespace EmployeeAPI.Entities.Helper;

public static class Constants
{
    #region Common Msg
    public const string UNAUTHORIZED_USER = "User is not authorized.";

    #region Entity Field Names
    public const string IS_DELETED = "IsDeleted";
    public const string ID = "Id";
    #endregion

    #region Linq Function Names
    public const string WHERE = "Where";
    public const string ORDER_BY = "OrderBy";
    #endregion

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
    #endregion
}