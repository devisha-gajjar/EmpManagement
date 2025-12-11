using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/project-members")]
[Authorize(Roles = "Admin")]
public class ProjectMemberController(IProjectMemberService projectMemberService) : ControllerBase
{
    [HttpPost("add")]
    public async Task<IActionResult> AddMember([FromBody] ProjectMemberRequest request)
    {
        var result = await projectMemberService.AddMember(request);
        return Ok(ApiResponse<ProjectMemberResponse>.Success(result, "Member added"));
    }

    [HttpPut("update/{projectMemberId}")]
    public async Task<IActionResult> UpdateMember(int projectMemberId, [FromBody] ProjectMemberRequest request)
    {
        var result = await projectMemberService.UpdateMember(projectMemberId, request);
        return Ok(ApiResponse<ProjectMemberResponse>.Success(result, "Member updated"));
    }

    [HttpDelete("delete/{projectMemberId}")]
    public async Task<IActionResult> DeleteMember(int projectMemberId)
    {
        var result = await projectMemberService.DeleteMember(projectMemberId);
        return Ok(ApiResponse<bool>.Success(result, "Member deleted"));
    }

    [HttpGet("{projectMemberId}")]
    public async Task<IActionResult> GetMember(int projectMemberId)
    {
        var result = await projectMemberService.GetMember(projectMemberId);
        return Ok(ApiResponse<ProjectMemberResponse>.Success(result, "Fetched"));
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetMembersByProject(int projectId)
    {
        var result = await projectMemberService.GetMembersByProject(projectId);
        return Ok(ApiResponse<List<ProjectMemberResponse>>.Success(result, "Fetched"));
    }
}

