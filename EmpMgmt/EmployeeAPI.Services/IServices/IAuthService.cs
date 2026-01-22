using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices;

public interface IAuthService
{
    public User? Register(User user, string password);
    Task<LoginResponse> Login(UserLoginDto dto);
    Task<AuthTokenResponseDto> VerifyTwoFactorAsync(Verify2FADto dto);
    Task<(string accessToken, string refreshToken)> ValidateRefreshTokens(string refreshToken);
    Task<(string accessToken, string refereshToken)> AuthenticateUser(UserLoginDto userLoginDto);
}
