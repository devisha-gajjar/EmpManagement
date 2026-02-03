namespace EmployeeAPI.Entities.DTO.RequestDto;

public class AddWorkLogRequestDto
{
    public decimal HoursSpent { get; set; }
    public DateTime LogDate { get; set; }
    public string Description { get; set; }
}
