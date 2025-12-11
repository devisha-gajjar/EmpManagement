using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class TaskAttachment
{
    public int AttachmentId { get; set; }

    public int? TaskId { get; set; }

    public int? UploadedBy { get; set; }

    public string FileUrl { get; set; } = null!;

    public DateTime? UploadedOn { get; set; }

    public virtual UserTask? Task { get; set; }

    public virtual User? UploadedByNavigation { get; set; }
}
