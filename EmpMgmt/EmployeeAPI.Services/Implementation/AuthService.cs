using System.Security.Claims;
using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Services.Implementation
{
    public class AuthService(EmployeeMgmtContext db, ICustomService customService, IGenericRepository<User> userRepository, ITwoFactorService twoFactorService, ITokenService tokenService) : IAuthService
    {
        #region Register
        public User? Register(User user, string password)
        {
            if (db.Users.Any(u => u.Email == user.Email || u.Username == user.Username))
                return null;

            user.RoleId = 2;
            user.Password = customService.Hash(password);
            user.CreatedOn = DateTime.Now;
            user.IsDeleted = false;

            db.Users.Add(user);
            db.SaveChanges();

            return user;
        }
        #endregion

        #region Login
        public async Task<LoginResponse> Login(UserLoginDto dto)
        {
            var user = await userRepository.GetByInclude(
                u => (u.Email == dto.Email || u.Username == dto.Email) && !u.IsDeleted,
                q => q.Include(u => u.Role)
            ) ?? throw new AppException(Constants.INVALID_LOGIN_CREDENTIALS_MESSAGE);

            if (!customService.Verify(dto.Password, user.Password))
                throw new AppException(Constants.INVALID_LOGIN_CREDENTIALS_MESSAGE);

            // 2FA enabled
            if (user.IsTwoFactorEnabled)
            {
                return new LoginResponse
                {
                    Step = string.IsNullOrWhiteSpace(user.TwoFactorSecret)
                        ? LoginStep.RequireTwoFactorSetup
                        : LoginStep.RequireTwoFactor,
                    TempToken = customService.GenerateTempToken(user.UserId, dto.RememberMe)
                };
            }

            // No 2FA → issue tokens
            return IssueTokens(user, dto.RememberMe);
        }

        private LoginResponse IssueTokens(User user, bool rememberMe)
        {
            var accessToken = tokenService.GenerateAccessToken(user);
            var refreshToken = tokenService.GenerateRefreshToken(user, rememberMe);

            return new LoginResponse
            {
                Step = LoginStep.Success,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<(string accessToken, string refereshToken)> AuthenticateUser(UserLoginDto userLoginDto)
        {
            if (userLoginDto == null || string.IsNullOrEmpty(userLoginDto.Email) || string.IsNullOrEmpty(userLoginDto.Password))
            {
                throw new ArgumentException(Constants.INVALID_LOGIN_CREDENTIALS_MESSAGE);
            }

            User? user = await userRepository.GetByInclude(u => u.Email.ToLower() == userLoginDto.Email.ToLower() && !u.IsDeleted,
                                                                query => query.Include(u => u.Role)) ?? throw new ArgumentException(Constants.USER_NOT_FOUND);


            if (!customService.Verify(userLoginDto.Password, user.Password))
            {
                throw new AppException(Constants.INVALID_LOGIN_CREDENTIALS_MESSAGE);
            }

            string accessToken = tokenService.GenerateAccessToken(user);
            string refreshToken = tokenService.GenerateRefreshToken(user, userLoginDto.RememberMe);
            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            {
                throw new Exception(Constants.FAILED_TOKEN_GENERATION_MESSAGE);
            }

            return (accessToken, refreshToken);
        }

        #endregion

        #region Verify 2FA token
        public async Task<AuthTokenResponseDto> VerifyTwoFactorAsync(Verify2FADto dto)
        {
            // 1. Validate temporary JWT (issued after username/password)
            var principal = customService.ValidateTempToken(dto.TempToken)
                ?? throw new AppException("Invalid or expired temporary token");

            var userId = int.Parse(
                principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new AppException("Invalid token payload")
            );

            // 2. Load user
            var user = userRepository.GetById(userId)
                ?? throw new AppException("User not found");

            if (string.IsNullOrWhiteSpace(user.TwoFactorSecret))
                throw new AppException("2FA is not enabled for this user");

            // 3. Validate TOTP code
            var isValid = twoFactorService.ValidateCode(
                user.TwoFactorSecret,
                dto.Code
            );

            var rememberMe = bool.Parse(principal.FindFirst(ClaimTypes.UserData)?.Value!);
            if (!isValid)
                throw new AppException("Invalid authentication code");

            // 4. Issue final access token
            var accessToken = customService.GenerateJwtToken(user.Username);
            var refreshToken = tokenService.GenerateRefreshToken(user, rememberMe);

            return new AuthTokenResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                RememberMe = rememberMe
            };
        }
        #endregion

        #region Validate Refresh Token
        public async Task<(string accessToken, string refreshToken)> ValidateRefreshTokens(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new ArgumentException(Constants.REFRESH_TOKEN_REQUIRED_MESSAGE);
            }

            ClaimsPrincipal principal;
            bool isExpired = false;

            try
            {
                principal = tokenService.ValidateToken(refreshToken, validateLifetime: true);
            }
            catch (AppException ex) when (ex.StatusCode == StatusCodes.Status401Unauthorized && ex.Message.Contains("expired"))
            {
                principal = tokenService.ValidateToken(refreshToken, validateLifetime: false);
                isExpired = true;
            }

            if (principal == null || principal.Identity == null || !principal.Identity.IsAuthenticated)
            {
                throw new ArgumentException(Constants.INVALID_DATA_MESSAGE);
            }

            var userIdStr = tokenService.GetUserIdFromToken(principal);
            if (!int.TryParse(userIdStr, out int userId))
            {
                throw new ArgumentException(Constants.INVALID_USER_ID_MESSAGE);
            }

            User? user = await userRepository.GetByInclude(u => u.UserId == userId && !u.IsDeleted,
                query => query.Include(u => u.Role))
                ?? throw new ArgumentException(Constants.USER_NOT_FOUND);

            if (isExpired)
            {
                throw new AppException(Constants.EXPIRED_LOGIN_SESSION_MESSAGE, StatusCodes.Status401Unauthorized);
            }

            string newAccessToken = tokenService.GenerateAccessToken(user);
            string newRefreshToken = tokenService.GenerateRefreshToken(user, tokenService.IsRememberMeEnabled(principal));

            if (string.IsNullOrEmpty(newAccessToken) || string.IsNullOrEmpty(newRefreshToken))
            {
                throw new Exception(Constants.FAILED_TOKEN_GENERATION_MESSAGE);
            }

            return (newAccessToken, newRefreshToken);
        }
        #endregion
    }
}
