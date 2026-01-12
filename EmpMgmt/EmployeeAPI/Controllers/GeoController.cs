using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/geo")]
public class GeoController(IGeoLocationService geoService) : ControllerBase
{
    private readonly IGeoLocationService _geoService = geoService;

    [HttpGet("country")]
    public async Task<IActionResult> GetCountry([FromQuery] string? ip)
    {
        // 1️⃣ If IP not provided, get server public IP
        if (string.IsNullOrWhiteSpace(ip))
        {
            ip = await ClientIpResolver.GetPublicIpAddressAsync();
        }

        if (string.IsNullOrWhiteSpace(ip))
            return BadRequest("Public IP could not be determined");

        // 2️⃣ Geo lookup
        var result = _geoService.GetCountryByIp(ip);

        if (result == null)
            return BadRequest("Invalid or unsupported public IP address");

        return Ok(new
        {
            ip,
            country = result.Country.Name,
            isoCode = result.Country.IsoCode,
            continent = result.Continent.Name
        });
    }

}
