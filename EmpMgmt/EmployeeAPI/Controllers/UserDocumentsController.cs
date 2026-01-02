using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/user-documents")]
[Authorize]
public class UserDocumentsController(IUserDocumentService userDocumentService) : ControllerBase
{
    private readonly IUserDocumentService _userDocumentService = userDocumentService;

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadDocuments(
        [FromForm] UploadUserDocumentsRequestDto dto)
    {
        if (dto.Files == null || dto.Files.Count == 0)
        {
            return BadRequest(new
            {
                result = false,
                message = "At least one document must be uploaded"
            });
        }

        var documents = await _userDocumentService.UploadDocumentsAsync(dto);

        return Ok(new
        {
            result = true,
            message = "Documents uploaded successfully",
            data = documents
        });
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllDocuments(
       [FromQuery] DocumentStatus? status)
    {
        var documents = await _userDocumentService.GetAllAsync(status);

        return Ok(new
        {
            result = true,
            message = "Documents fetched successfully",
            data = documents
        });
    }

    [HttpGet("my-documents")]
    public async Task<IActionResult> GetMyDocuments()
    {
        var documents = await _userDocumentService.GetByUserAsync();

        return Ok(new
        {
            result = true,
            message = "Documents fetched successfully",
            data = documents
        });
    }
}
