using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices;

public interface IAuthService
{
    public User? Register(User user, string password);
    public LoginResponse Login(string usernameOrEmail, string password);
    Task<AuthTokenResponseDto> VerifyTwoFactorAsync(Verify2FADto dto);
}
