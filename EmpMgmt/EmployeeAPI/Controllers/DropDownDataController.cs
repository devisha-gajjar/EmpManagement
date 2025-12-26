using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using static EmployeeAPI.Entities.Enums.Enum;

namespace QuizVerse.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[ProducesResponseType(
    typeof(ApiResponse<List<CommonListDropDownDto>>),
    StatusCodes.Status200OK
)]
[ProducesResponseType(
    typeof(ApiResponse<object>),
    StatusCodes.Status400BadRequest
)]
[ProducesResponseType(
    typeof(ApiResponse<object>),
    StatusCodes.Status500InternalServerError
)]
public class DropDownDataController(IDropDownDataService _dropDownService) : ControllerBase
{
    [HttpGet("get-dropdown-data")]
    public IActionResult GetDropDownData([FromQuery] DropDownType type)
    {
        ApiResponse<List<CommonListDropDownDto>> response = new()
        {
            Result = true,
            StatusCode = StatusCodes.Status200OK,
            Message = $"{type} " + Constants.FETCH_SUCCESS,
            Data = _dropDownService.GetDropDownListData(type)
        };

        return Ok(response);
    }
}