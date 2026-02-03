using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;

namespace EmployeeAPI.Services.IServices;

public interface IWorkFlowService
{
    Task<List<TaskResponseDto>> GetTasksByUserIdAsync();
    Task<TaskDetailResponseDto> GetTaskDetails(int taskId);
    Task<TaskCommentDto> AddComment(int taskId, AddCommentRequestDto dto);
    Task<(TaskWorkLogDto WorkLog, decimal TotalHours)>
        AddWorkLog(int taskId, AddWorkLogRequestDto dto);
    Task<TaskTimelineDto> UpdateStatus(int taskId, UpdateStatusRequestDto dto);
}
