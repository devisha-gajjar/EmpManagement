using System;
using System.Collections.Generic;

namespace EmployeeAPI.Entities.Models;

public partial class UserDocument
{
    public int DocumentId { get; set; }

    public int UserId { get; set; }

    public string DocumentName { get; set; } = null!;

    public string DocumentType { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public long FileSize { get; set; }

    public string Status { get; set; } = null!;

    public string? RejectionReason { get; set; }

    public DateTime UploadedOn { get; set; }

    public DateTime? ApprovedOn { get; set; }

    public int? ApprovedBy { get; set; }

    public bool IsDeleted { get; set; }

    public virtual User? ApprovedByNavigation { get; set; }

    public virtual User User { get; set; } = null!;
}
