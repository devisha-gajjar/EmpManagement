using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers;

[ApiController]
[Route("api/geo")]
public class GeoController(IGeoLocationService geoService) : ControllerBase
{
    private readonly IGeoLocationService _geoService = geoService;

    [HttpGet("country")]
    public IActionResult GetCountry([FromQuery] string? ip)
    {
        // 1️⃣ If no IP provided, use client IP
        if (string.IsNullOrWhiteSpace(ip))
        {
            ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        }

        if (string.IsNullOrWhiteSpace(ip))
            return BadRequest("Could not determine client IP");

        // 2️⃣ Get country info
        var result = _geoService.GetCountryByIp(ip);

        if (result == null)
            return BadRequest("Invalid or unsupported IP address");

        return Ok(new
        {
            ip,
            country = result.Country.Name,
            isoCode = result.Country.IsoCode,
            continent = result.Continent.Name
        });
    }
}
