namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class TaskDetailResponseDto
{
    public TaskHeaderDto Task { get; set; }
    public TaskStatsDto Stats { get; set; }
    public List<TaskTagDto> Tags { get; set; }
    public List<TaskTimelineDto> Timeline { get; set; }
    public List<TaskWorkLogDto> WorkLogs { get; set; }
    public List<TaskCommentDto> Comments { get; set; }
    public List<TaskAttachmentDto> Attachments { get; set; }
}

public class TaskHeaderDto
{
    public int TaskId { get; set; }
    public string TaskName { get; set; } = null!;
    public string? Description { get; set; }

    public string? Status { get; set; }
    public string? Priority { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }

    public int ProjectId { get; set; }
    public int? AssignedTo { get; set; }
    public int? AssignedBy { get; set; }

    public decimal? EstimatedHours { get; set; }
    public decimal SpentHours { get; set; }
    public DateTime? CompletedOn { get; set; }
}

public class TaskStatsDto
{
    public decimal EstimatedHours { get; set; }
    public decimal TotalLoggedHours { get; set; }
}

public class TaskTimelineDto
{
    public int ActivityId { get; set; }
    public string Action { get; set; }
    public string OldValue { get; set; }
    public string NewValue { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public DateTime CreatedOn { get; set; }
}

public class TaskCommentDto
{
    public int CommentId { get; set; }
    public int CreatedBy { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedOn { get; set; }
}

public class TaskWorkLogDto
{
    public int WorkLogId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public decimal HoursSpent { get; set; }
    public DateTime LogDate { get; set; }
    public string Description { get; set; }
    public DateTime CreatedOn { get; set; }
}

public class TaskAttachmentDto
{
    public int AttachmentId { get; set; }
    public string FileUrl { get; set; }
    public int UploadedBy { get; set; }
    public DateTime UploadedOn { get; set; }
}

public class TaskTagDto
{
    public int TagId { get; set; }
    public string Name { get; set; }
}
