using EmployeeAPI.Entities.DTO.ResponseDto;
using MaxMind.GeoIP2.Responses;

namespace EmployeeAPI.Services.IServices;

public interface IGeoLocationService
{
    public CountryResponse? GetCountryByIp(string ipAddress);
    Task<AddressDto?> GetAddressAsync(double latitude, double longitude);
}
