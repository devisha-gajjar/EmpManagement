using ClosedXML.Excel;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;

namespace EmployeeAPI.Services.Implementation;

public class EmployeeService(IEmployeeRepository empRepository, ICustomService customService) : IEmployeeService
{
    private readonly IEmployeeRepository _empRepository = empRepository;

    public IEnumerable<EmployeeListDto> GetEmployees()
    {
        var employees = _empRepository.GetEmployeesWithDepartments();
        return employees.OrderBy(e => e.Id).Select(e => new EmployeeListDto
        {
            Id = e.Id,
            Name = e.Name,
            Email = e.Email,
            DepartmentName = e.Department?.Name,
            DepartmentId = e.DepartmentId,
            Salary = e.Salary,
            CreatedOn = e.CreatedOn
        });
    }

    public AddEmployeeViewModelDto GetEmployeeById(int id)
    {
        var emp = _empRepository.GetEmployeeWithDepartmentById(id);
        if (emp == null)
            return null;

        return new AddEmployeeViewModelDto
        {
            Id = emp.Id,
            Name = emp.Name,
            Email = emp.Email,
            DepartmentId = emp.DepartmentId,
            Salary = emp.Salary
        };
    }

    public Employee? AddEmployee(AddEmployeeViewModelDto employeeDto)
    {
        if (_empRepository.EmployeeExistsByEmail(employeeDto.Email))
            return null;

        var emp = new Employee
        {
            Name = employeeDto.Name,
            Email = employeeDto.Email,
            DepartmentId = employeeDto.DepartmentId,
            Salary = employeeDto.Salary,
            CreatedOn = DateTime.Now
        };

        _empRepository.Add(emp);
        return _empRepository.GetById(emp.Id);
    }

    public bool UpdateEmployee(int id, AddEmployeeViewModelDto employeeDto)
    {
        if (id != employeeDto.Id)
            return false;

        var existing = _empRepository.GetById(id);
        if (existing == null)
            return false;

        if (existing.Email != employeeDto.Email && _empRepository.EmployeeExistsByEmail(employeeDto.Email))
        {
            return false;
        }

        existing.Name = employeeDto.Name;
        existing.Email = employeeDto.Email;
        existing.DepartmentId = employeeDto.DepartmentId;
        existing.Salary = employeeDto.Salary;

        _empRepository.Update(existing);
        return true;
    }

    public bool DeleteEmployee(int id)
    {
        var emp = _empRepository.GetById(id);
        if (emp == null)
            return false;

        _empRepository.Delete(emp);
        return true;
    }
    #region Employee Export
    public async Task<MemoryStream> ExportEmployees()
    {
        var employees = _empRepository.GetEmployeesWithDepartments()
            .OrderBy(e => e.Id)
            .Select((e, index) => new EmployeeListDto
            {
                Id = e.Id,
                Name = e.Name,
                Email = e.Email ?? "-",
                DepartmentName = e.Department != null ? e.Department.Name : "-",
                Salary = e.Salary,
                CreatedOn = e.CreatedOn
            })
            .ToList();

        if (!employees.Any())
            throw new AppException(Constants.EMPLOYEE_DATA_NULL);

        Action<IXLWorksheet> worksheetSetup = worksheet =>
        {
            (string LabelCell, string ValueCell, string Label, string Value)[] headerInfo =
            [
                ("A7", "B7", "Exported On:", DateTime.Now.ToString("dd MMM yyyy")),
            ("D7", "E7", "Total Records:", employees.Count.ToString()),
            ("G7", "H7", "Module:", "Employees")
            ];

            foreach (var (labelCellAddr, valueCellAddr, label, value) in headerInfo)
            {
                var labelCell = worksheet.Cell(labelCellAddr);
                var valueCell = worksheet.Cell(valueCellAddr);

                labelCell.Value = label;
                valueCell.Value = value;

                labelCell.Style.Font.Bold = true;
                labelCell.Style.Fill.BackgroundColor = XLColor.FromHtml(Constants.LIGHT_BLUE);
                labelCell.Style.Font.FontColor = XLColor.White;
                labelCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                labelCell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                labelCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                valueCell.Style.Font.Bold = true;
                valueCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                valueCell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                valueCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }
        };

        return customService.ExportToExcel(
            employees,
            "Employees",
            XLTableTheme.TableStyleMedium9,
            startRow: 10,
            startCol: 1,
            setup: worksheetSetup
        );
    }
    #endregion

}
