using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Services.IServices;

public interface IAuthService
{
    public User? Register(User user, string password);
    public string? Login(string usernameOrEmail, string password);
}
