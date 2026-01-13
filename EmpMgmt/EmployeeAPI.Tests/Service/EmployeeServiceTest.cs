using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.Implementation;
using FluentAssertions;
using Moq;

namespace EmployeeAPI.Tests.Service;

public class EmployeeServiceTest
{

    private readonly Mock<IEmployeeRepository> _employeeRepoMock;
    private readonly EmployeeService _employeeService;

    public EmployeeServiceTest()
    {
        _employeeRepoMock = new Mock<IEmployeeRepository>();
        _employeeService = new EmployeeService(_employeeRepoMock.Object);
    }

    [Fact]
    public void GetEmployees_ShouldReturnSortedListOfEmployeeDTOs()
    {
        // Arrange
        var employees = new List<Employee>
        {
            new() { Id = 2, Name = "John", Email = "john@example.com", DepartmentId = 1, Salary = 5000, CreatedOn = DateTime.Now, Department = new Department { Name = "HR" } },
            new() { Id = 1, Name = "Jane", Email = "jane@example.com", DepartmentId = 2, Salary = 6000, CreatedOn = DateTime.Now, Department = new Department { Name = "Finance" } }
        };
        _employeeRepoMock.Setup(r => r.GetEmployeesWithDepartments()).Returns(employees);

        // Act
        var result = _employeeService.GetEmployees().ToList();

        // Assert
        result.Should().HaveCount(2);
        result[0].Id.Should().Be(1); // Sorted by Id that's why it is 1 here 
        result[1].Id.Should().Be(2);
    }

    [Fact]
    public void GetEmployeeById_ShouldReturnEmployeeDTO_IfExists()
    {
        // Arrange
        var emp = new Employee { Id = 1, Name = "Alice", Email = "alice@example.com", DepartmentId = 2 };
        _employeeRepoMock.Setup(r => r.GetEmployeeWithDepartmentById(1)).Returns(emp);

        // Act
        var result = _employeeService.GetEmployeeById(1);

        // Assert  --> using the fluent assertations
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.Name.Should().Be("Alice");
    }

    [Fact]
    public void GetEmployeeById_ShouldReturnNull_IfNotFound()
    {
        _employeeRepoMock.Setup(r => r.GetEmployeeWithDepartmentById(It.IsAny<int>())).Returns((Employee?)null);

        var result = _employeeService.GetEmployeeById(999);

        result.Should().BeNull();
    }

    [Fact]
    public void AddEmployee_ShouldReturnNull_IfEmailExists()
    {
        var dto = new AddEmployeeViewModelDto { Email = "test@example.com" };
        _employeeRepoMock.Setup(r => r.EmployeeExistsByEmail(dto.Email)).Returns(true);

        var result = _employeeService.AddEmployee(dto);

        result.Should().BeNull();
    }

    [Fact]
    public void AddEmployee_ShouldAddEmployee_IfEmailNotExists()
    {
        var dto = new AddEmployeeViewModelDto
        {
            Name = "Tom",
            Email = "tom@example.com",
            DepartmentId = 1,
            Salary = 5000
        };

        var createdEmployee = new Employee
        {
            Id = 10,
            Name = "Tom",
            Email = "tom@example.com",
            DepartmentId = 1,
            Salary = 5000,
            CreatedOn = DateTime.Now
        };

        _employeeRepoMock.Setup(r => r.EmployeeExistsByEmail(dto.Email)).Returns(false);
        _employeeRepoMock.Setup(r => r.Add(It.IsAny<Employee>()));
        _employeeRepoMock.Setup(r => r.GetById(It.IsAny<int>())).Returns(createdEmployee);

        var result = _employeeService.AddEmployee(dto);

        result.Should().NotBeNull();
        result.Id.Should().Be(10);
        result.Email.Should().Be("tom@example.com");
    }

    [Fact]
    public void UpdateEmployee_ShouldReturnFalse_IfIdMismatch()
    {
        var dto = new AddEmployeeViewModelDto { Id = 2 };
        var result = _employeeService.UpdateEmployee(1, dto);
        result.Should().BeFalse();
    }

    [Fact]
    public void UpdateEmployee_ShouldReturnFalse_IfEmployeeNotFound()
    {
        var dto = new AddEmployeeViewModelDto { Id = 1 };
        _employeeRepoMock.Setup(r => r.GetById(1)).Returns((Employee?)null);

        var result = _employeeService.UpdateEmployee(1, dto);
        result.Should().BeFalse();
    }

    [Fact]
    public void UpdateEmployee_ShouldReturnFalse_IfEmailAlreadyExists()
    {
        var dto = new AddEmployeeViewModelDto
        {
            Id = 1,
            Email = "new@example.com"
        };

        var existing = new Employee
        {
            Id = 1,
            Email = "old@example.com"
        };

        _employeeRepoMock.Setup(r => r.GetById(1)).Returns(existing);
        _employeeRepoMock.Setup(r => r.EmployeeExistsByEmail("new@example.com")).Returns(true);

        var result = _employeeService.UpdateEmployee(1, dto);
        result.Should().BeFalse();
    }

    [Fact]
    public void UpdateEmployee_ShouldUpdateSuccessfully()
    {
        var dto = new AddEmployeeViewModelDto
        {
            Id = 1,
            Name = "Updated",
            Email = "updated@example.com",
            DepartmentId = 2,
            Salary = 7000
        };

        var existing = new Employee
        {
            Id = 1,
            Name = "Old",
            Email = "old@example.com",
            DepartmentId = 1,
            Salary = 6000
        };

        _employeeRepoMock.Setup(r => r.GetById(1)).Returns(existing);
        _employeeRepoMock.Setup(r => r.EmployeeExistsByEmail(dto.Email)).Returns(false);

        var result = _employeeService.UpdateEmployee(1, dto);
        result.Should().BeTrue();
    }

    [Fact]
    public void DeleteEmployee_ShouldReturnFalse_IfNotFound()
    {
        _employeeRepoMock.Setup(r => r.GetById(999)).Returns((Employee?)null);

        var result = _employeeService.DeleteEmployee(999);
        result.Should().BeFalse();
    }

    [Fact]
    public void DeleteEmployee_ShouldDeleteSuccessfully()
    {
        var emp = new Employee { Id = 5 };
        _employeeRepoMock.Setup(r => r.GetById(5)).Returns(emp);

        var result = _employeeService.DeleteEmployee(5);
        result.Should().BeTrue();

        _employeeRepoMock.Verify(r => r.Delete(emp), Times.Once);    // times once means method called for one time 
    }

}
