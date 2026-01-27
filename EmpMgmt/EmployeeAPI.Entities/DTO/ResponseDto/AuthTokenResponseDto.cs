namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class AuthTokenResponseDto
{
    public string AccessToken { get; set; } = default!;
    public string? RefreshToken { get; set; }
    public bool RememberMe { get; set; }
}
