using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
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

    [HttpGet("{taskId:int}")]
    [ProducesResponseType(typeof(TaskDetailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTaskDetail(int taskId)
    {
        var result = await taskService.GetTaskDetails(taskId);

        return Ok(ApiResponse<TaskDetailResponseDto>.Success(
            result,
            Constants.FETCH_SUCCESS
        ));
    }

    [HttpPost("{taskId:int}/comments")]
    [ProducesResponseType(typeof(TaskCommentDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AddComment(
        int taskId,
        [FromBody] AddCommentRequestDto dto)
    {
        var result = await taskService.AddComment(taskId, dto);

        return Ok(ApiResponse<TaskCommentDto>.Success(
            result,
            Constants.CREATE_SUCCESS
        ));
    }

    [HttpPost("{taskId:int}/worklogs")]
    public async Task<IActionResult> AddWorkLog(
        int taskId,
        [FromBody] AddWorkLogRequestDto dto)
    {
        var (workLog, totalHours) =
            await taskService.AddWorkLog(taskId, dto);

        return Ok(ApiResponse<object>.Success(
            new
            {
                WorkLog = workLog,
                TotalHours = totalHours
            },
            Constants.CREATE_SUCCESS
        ));
    }

    [HttpPatch("{taskId:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int taskId,
        [FromBody] UpdateStatusRequestDto dto)
    {
        var result = await taskService.UpdateStatus(taskId, dto);

        return Ok(ApiResponse<TaskTimelineDto>.Success(
            result,
            Constants.UPDATE_SUCCESS
        ));
    }
}
