using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EmployeeAPI.Services.IServices;
using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize(Roles = "Admin")]
public class UserTaskController(IUserTaskService taskService) : ControllerBase
{
    [HttpPost("save")]
    public async Task<IActionResult> SaveTask([FromBody] TaskDto dto)
    {
        var response = await taskService.UpsertAsync(dto);

        return Ok(ApiResponse<TaskResponseDto>.Success(
            response,
            dto.TaskId == null || dto.TaskId == 0
                ? Constants.TASK_CREATED
                : Constants.TASK_UPDATED
        ));
    }

    // DELETE
    [HttpDelete("{taskId:int}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var deleted = await taskService.DeleteAsync(taskId);

        if (deleted)
            return Ok(ApiResponse<string>.Success(
                "Deleted",
                Constants.TASK_DELETED
            ));
        else
            return Ok(ApiResponse<string>.Fail(
                    "Deleted",
                    401
                ));
    }
}
