using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class LoginResponse
{
    public LoginStep Step { get; set; }
    public int FailedLoginAttempt { get; set; }
    public string? Message { get; set; }
    public string? AccessToken { get; set; }
    public string? TempToken { get; set; }
    public string? RefreshToken { get; set; }
}
