namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class LoginResponse
{
    public bool RequiresTwoFactor { get; set; }
    public string? AccessToken { get; set; }
    public string? TempToken { get; set; }
}
