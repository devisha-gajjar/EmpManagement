using EmployeeAPI.Controllers;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Services.IServices;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace EmployeeAPI.Tests.Controller;

public class EmployeeControllerTest
{
    private readonly Mock<IEmployeeService> _serviceMock;
    private readonly EmployeeController _controller;

    public EmployeeControllerTest()
    {
        _serviceMock = new Mock<IEmployeeService>();
        _controller = new EmployeeController(_serviceMock.Object);
    }

    [Fact]
    public void GetEmployeeList_ShouldReturnOkResultWithData()
    {
        // Arrange
        var employeeList = new List<EmployeeListDTO>
            {
                new() { Id = 1, Name = "Alice", Email = "alice@example.com" },
                new() { Id = 2, Name = "Bob", Email = "bob@example.com" }
            };
        _serviceMock.Setup(s => s.GetEmployees()).Returns(employeeList);

        // Act
        var result = _controller.GetEmployeeList();

        // Assert
        var okResult = result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(employeeList);
    }

    [Fact]
    public void GetById_ShouldReturnOk_WhenEmployeeExists()
    {
        var dto = new AddEmployeeViewModelDTO { Id = 1, Name = "Alice", Email = "alice@example.com" };
        _serviceMock.Setup(s => s.GetEmployeeById(1)).Returns(dto);

        var result = _controller.GetById(1);

        var okResult = result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.StatusCode.Should().Be(200);
        okResult.Value.Should().Be(dto);
    }

    [Fact]
    public void GetById_ShouldReturnNotFound_WhenEmployeeDoesNotExist()
    {
        _serviceMock.Setup(s => s.GetEmployeeById(99)).Returns((AddEmployeeViewModelDTO)null!);

        var result = _controller.GetById(99);

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public void AddEmployee_ShouldReturnCreated_WhenEmployeeAdded()
    {
        var dto = new AddEmployeeViewModelDTO { Name = "John", Email = "john@example.com", DepartmentId = 1 };
        var created = new Employee { Id = 10, Name = "John", Email = "john@example.com" };

        _serviceMock.Setup(s => s.AddEmployee(dto)).Returns(created);

        var result = _controller.AddEmployee(dto);

        var createdResult = result as CreatedAtActionResult;
        createdResult.Should().NotBeNull();
        createdResult!.StatusCode.Should().Be(201);
        createdResult.Value.Should().Be(created);
    }

    [Fact]
    public void AddEmployee_ShouldReturnBadRequest_WhenEmployeeExists()
    {
        var dto = new AddEmployeeViewModelDTO { Name = "John", Email = "john@example.com", DepartmentId = 1 };
        _serviceMock.Setup(s => s.AddEmployee(dto)).Returns((Employee)null!);

        var result = _controller.AddEmployee(dto);

        var badRequest = result as BadRequestObjectResult;
        badRequest.Should().NotBeNull();
        badRequest!.Value.Should().Be("Employee Already Exists!!");
    }

    [Fact]
    public void EditEmployee_ShouldReturnNoContent_WhenSuccessful()
    {
        var dto = new AddEmployeeViewModelDTO { Id = 1, Name = "Alice", Email = "alice@example.com", DepartmentId = 1 };
        _serviceMock.Setup(s => s.UpdateEmployee(1, dto)).Returns(true);

        var result = _controller.EditEmployee(1, dto);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public void EditEmployee_ShouldReturnBadRequest_WhenUpdateFails()
    {
        var dto = new AddEmployeeViewModelDTO { Id = 1, Name = "Alice", Email = "alice@example.com", DepartmentId = 1 };
        _controller.ModelState.AddModelError("Email", "Required");

        var result = _controller.EditEmployee(1, dto);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public void Delete_ShouldReturnNoContent_WhenSuccessful()
    {
        _serviceMock.Setup(s => s.DeleteEmployee(1)).Returns(true);

        var result = _controller.Delete(1);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public void Delete_ShouldReturnNotFound_WhenEmployeeNotFound()
    {
        _serviceMock.Setup(s => s.DeleteEmployee(999)).Returns(false);

        var result = _controller.Delete(999);

        result.Should().BeOfType<NotFoundResult>();
    }
}
