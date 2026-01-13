using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.Implementation;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;


namespace EmployeeAPI.Tests.Repository;

public class EmployeeRepositoryTest
{
    private readonly EmployeeMgmtContext _context;
    private readonly EmployeeRepository _repository;

    public EmployeeRepositoryTest()
    {
        // var options = new DbContextOptionsBuilder<EmployeeMgmtContext>()  // new db for each test case -- so no interfear between the test cases 
        //     .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        //     .Options;

        // _context = new EmployeeMgmtContext(options);   // new instance of that db
        var options = new DbContextOptionsBuilder<EmployeeMgmtContext>()
                    .UseInMemoryDatabase(Guid.NewGuid().ToString()) // No Npgsql involved here
                    .Options;

        var _context = new EmployeeMgmtContext(options);


        // Seed department
        var dept = new Department { Id = 1, Name = "HR" };
        _context.Departments.Add(dept);

        // Seed employees
        _context.Employees.AddRange(
            new Employee { Id = 1, Name = "Alice", Email = "alice@example.com", DepartmentId = 1, Department = dept },
            new Employee { Id = 2, Name = "Bob", Email = "bob@example.com", DepartmentId = 1, Department = dept }
        );

        _context.SaveChanges();

        _repository = new EmployeeRepository(_context);
    }

    [Theory]
    [InlineData("alice@example.com", true)]
    [InlineData("bob@example.com", true)]
    [InlineData("charlie@example.com", false)]
    public void EmployeeExistsByEmail_ShouldWorkWithInlineData(string email, bool expected)
    {
        var result = _repository.EmployeeExistsByEmail(email);
        result.Should().Be(expected);
    }

    [Theory]
    [ClassData(typeof(EmployeeExistenceTestData))]
    public void EmployeeExistsByEmail_ShouldWorkWithClassData(string email, bool expected)
    {
        var result = _repository.EmployeeExistsByEmail(email);
        result.Should().Be(expected);
    }

    public static IEnumerable<object[]> GetByIdData =>
        new List<object[]>
        {
            new object[] { 1, true },
            new object[] { 2, true },
            new object[] { 999, false }
        };

    [Theory]
    [MemberData(nameof(GetByIdData))]
    public void GetEmployeeWithDepartmentById_ShouldMatchExistence(int id, bool exists)
    {
        var result = _repository.GetEmployeeWithDepartmentById(id);
        (result != null).Should().Be(exists);
    }

    [Fact]
    public void GetEmployeesWithDepartments_ShouldReturnListWithDepartments()
    {
        var result = _repository.GetEmployeesWithDepartments().ToList();

        result.Should().HaveCount(2);
        result.All(e => e.Department != null).Should().BeTrue();
        result[0].Department!.Name.Should().Be("HR");
    }
}


