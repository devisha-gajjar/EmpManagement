using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation
{
    public class AuthService(EmployeeMgmtContext db, ICustomService customService, IGenericRepository<User> userRepository, ITwoFactorService twoFactorService) : IAuthService
    {
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

        public LoginResponse Login(string usernameOrEmail, string password)
        {
            var user = db.Users
                .Include(u => u.Role)
                .FirstOrDefault(u =>
                    (u.Username == usernameOrEmail || u.Email == usernameOrEmail)
                    && !u.IsDeleted);

            if (user == null || !customService.Verify(password, user.Password))
                throw new AppException("Invalid credentials");

            if (user.IsTwoFactorEnabled)
            {
                return new LoginResponse
                {
                    RequiresTwoFactor = true,
                    TempToken = customService.GenerateTempToken(user.UserId)
                };
            }

            return new LoginResponse
            {
                AccessToken = customService.GenerateJwtToken(user.Username),
                RequiresTwoFactor = false
            };
        }

        public async Task<AuthTokenResponseDto> VerifyTwoFactorAsync(Verify2FADto dto)
        {
            // 1. Validate temporary JWT (issued after username/password)
            var principal = customService.ValidateTempToken(dto.TempToken)
                ?? throw new AppException("Invalid or expired temporary token");

            var userId = int.Parse(
                principal.FindFirst("uid")?.Value
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

            if (!isValid)
                throw new AppException("Invalid authentication code");

            // 4. Issue final access token
            var accessToken = customService.GenerateJwtToken(user.Username);

            return new AuthTokenResponseDto
            {
                AccessToken = accessToken
            };
        }
    }
}
