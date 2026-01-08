using EmployeeAPI.Entities.DTO.RequestDto;

namespace EmployeeAPI.Services.IServices;

public interface IEmailService
{
    Task<bool> SendEmailAsync(EmailRequestDto emailRequestDto);
}
