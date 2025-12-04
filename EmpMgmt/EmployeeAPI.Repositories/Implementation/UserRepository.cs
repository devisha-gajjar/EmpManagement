using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;

namespace EmployeeAPI.Repositories.Implementation;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly EmployeeMgmtContext _db;

    public UserRepository(EmployeeMgmtContext db) : base(db)
    {
        _db = db;
    }

    public User? GetUserByUsername(string username)
    {
        return _db.Users.FirstOrDefault(u => u.Username == username && !u.IsDeleted);
    }

    public bool UserExistsByUsernameOrEmail(string username, string email)
    {
        return _db.Users.Any(u => (u.Username == username || u.Email == email) && !u.IsDeleted);
    }

}
