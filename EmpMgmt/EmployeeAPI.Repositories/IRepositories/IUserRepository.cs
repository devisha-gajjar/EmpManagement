using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Repositories.IRepositories;

public interface IUserRepository : IGenericRepository<User>
{
    User? GetUserByUsername(string username);
    bool UserExistsByUsernameOrEmail(string username, string email);
}
