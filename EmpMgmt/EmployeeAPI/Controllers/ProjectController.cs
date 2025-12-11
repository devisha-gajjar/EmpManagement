using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EmployeeAPI.Services.IServices;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/Projects")]
[Authorize(Roles = "Admin")]
public class ProjectController(IProjectService projectService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var projects = await projectService.GetAllProjects();
        return Ok(ApiResponse<IEnumerable<ProjectResponse>>.Success(projects, "Projects fetched"));
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveProject([FromBody] ProjectRequest request)
    {
        var response = await projectService.SaveProject(request);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProjectById(int id)
    {
        var response = await projectService.GetProjectById(id);
        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await projectService.DeleteProject(id);
        return Ok(ApiResponse<string>.Success("Deleted", "Project deleted"));
    }
}
