using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/user/tasks")]
[Authorize(Roles = "User")]
public class WorkFlowController(IWorkFlowService taskService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyTasks()
    {
        var tasks = await taskService.GetTasksByUserIdAsync();

        return Ok(ApiResponse<List<TaskResponseDto>>.Success(
            tasks,
            Constants.FETCH_SUCCESS
        ));
    }

    [HttpGet("tasks/{taskId:int}")]
    [ProducesResponseType(typeof(TaskDetailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTaskDetail(int taskId)
    {
        var result = await taskService.GetTaskDetails(taskId);
        return Ok(result);
    }
}