namespace EmployeeAPI.Entities.DTO;

public class ApiResponse<T>
{
    public bool Result { get; set; }
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public T? Data { get; set; }

    public static ApiResponse<T> Success(T data, string message = "Success", int statusCode = 200)
    {
        return new ApiResponse<T>
        {
            Result = true,
            Message = message,
            StatusCode = statusCode,
            Data = data
        };
    }

    public static ApiResponse<T> Fail(string message, int statusCode = 500)
    {
        return new ApiResponse<T>
        {
            Result = false,
            Message = message,
            StatusCode = statusCode,
            Data = default
        };
    }
}
