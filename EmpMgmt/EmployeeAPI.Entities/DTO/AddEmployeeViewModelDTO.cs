namespace EmployeeAPI.Entities.DTO;

public class AddEmployeeViewModelDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public int DepartmentId { get; set; }
    public decimal? Salary { get; set; }
    public DateTime CreatedOn { get; set; }
}
