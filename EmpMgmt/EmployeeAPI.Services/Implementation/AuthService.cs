using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Services.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly EmployeeMgmtContext _db;
        private readonly ICustomService _customService;

        public AuthService(EmployeeMgmtContext db, ICustomService customService)
        {
            _db = db;
            _customService = customService;
        }

        public User? Register(User user, string password)
        {
            if (_db.Users.Any(u => u.Email == user.Email || u.Username == user.Username))
                return null;

            user.RoleId = 2;
            user.Password = _customService.Hash(password);
            user.CreatedOn = DateTime.Now;
            user.IsDeleted = false;

            _db.Users.Add(user);
            _db.SaveChanges();

            return user;
        }

        public string? Login(string usernameOrEmail, string password)
        {
            var user = _db.Users
                .Include(u => u.Role)
                .FirstOrDefault(u =>
                    (u.Username == usernameOrEmail || u.Email == usernameOrEmail) && !u.IsDeleted);

            if (user == null || !_customService.Verify(password, user.Password))
                return null;

            return _customService.GenerateJwtToken(user.Username);
        }
    }
}
