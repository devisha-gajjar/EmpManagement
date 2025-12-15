using EmployeeAPI.Entities.DTO.ResponseDto;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Services.IServices;

public interface IDropDownDataService
{
    List<CommonListDropDownDto> GetDropDownListData(DropDownType dropDownType);
    void ClearCache(DropDownType dropDownType);
}