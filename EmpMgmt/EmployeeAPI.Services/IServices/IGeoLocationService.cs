using MaxMind.GeoIP2.Responses;

namespace EmployeeAPI.Services.IServices;

public interface IGeoLocationService
{
    public CountryResponse? GetCountryByIp(string ipAddress);
}
