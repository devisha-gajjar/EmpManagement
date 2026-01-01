using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/worklog")]
[Authorize]
public class TaskWorkLogsController(ITaskWorkLogService taskWorkLogService) : ControllerBase
{
    [HttpGet("{taskId:int}")]
    public async Task<IActionResult> GetWorkLogsByTaskId(int taskId)
    {
        var result = await taskWorkLogService.GetWorkLogsByTaskIdAsync(taskId);

        return Ok(new ApiResponse<TaskWorkLogListResponseDto>
        {
            Result = true,
            Message = "Work logs fetched successfully",
            StatusCode = StatusCodes.Status200OK,
            Data = result
        });
    }
}
