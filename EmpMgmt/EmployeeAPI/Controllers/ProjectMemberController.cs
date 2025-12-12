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
    [HttpPost("add-or-update-member")]
    public async Task<IActionResult> AddOrUpdateMember([FromBody] ProjectMemberRequest request)
    {
        var result = await projectMemberService.AddOrUpdateMember(request);
        return Ok(ApiResponse<ProjectMemberResponse>.Success(result, "Member Saved"));
    }

    [HttpDelete("delete-member/{projectMemberId}")]
    public async Task<IActionResult> DeleteMember(int projectMemberId)
    {
        var result = await projectMemberService.DeleteMember(projectMemberId);
        return Ok(ApiResponse<bool>.Success(result, "Member deleted"));
    }

    [HttpGet("get-member/{projectMemberId}")]
    public async Task<IActionResult> GetMember(int projectMemberId)
    {
        var result = await projectMemberService.GetMember(projectMemberId);
        return Ok(ApiResponse<ProjectMemberResponse>.Success(result, "Fetched"));
    }

    [HttpGet("get-members-by-project/{projectId}")]
    public async Task<IActionResult> GetMembersByProject(int projectId)
    {
        var result = await projectMemberService.GetMembersByProject(projectId);
        return Ok(ApiResponse<List<ProjectMemberResponse>>.Success(result, "Fetched"));
    }
}

