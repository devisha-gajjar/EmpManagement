namespace EmployeeAPI.Entities.DTO;

public class LoginDTO
{
    public string UsernameOrEmail { get; set; } = null!;
    public string Password { get; set; } = null!;
}
