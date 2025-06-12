namespace EmployeeAPI.Entities.DTO;

public class AddEmployeeViewModelDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public int DepartmentId { get; set; }
}
