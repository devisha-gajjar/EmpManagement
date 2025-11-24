using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeAPI.Services.Implementation;

public class CustomService : ICustomService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _config;

    public CustomService(IUserRepository userRepository, IConfiguration config)
    {
        _userRepository = userRepository;
        _config = config;
    }

    #region PasswordHash
    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool Verify(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
    #endregion 

    #region Token
    public string GenerateJwtToken(string name)
    {
        User? user = _userRepository.GetAll().Include(u => u.Role).FirstOrDefault(u => u.Username == name);

        JwtSecurityTokenHandler tokenHandler = new();
        byte[] key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]!);

        Claim[]? authClaims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.RoleName),
                new Claim(ClaimTypes.Name,user.UserId.ToString())
            };

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);


        JwtSecurityToken token = new(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Issuer"],
            claims: authClaims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return tokenHandler.WriteToken(token);
    }
    #endregion
}
