using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class LoginResponse
{
    public LoginStep Step { get; set; }
    public string? AccessToken { get; set; }
    public string? TempToken { get; set; }
}
