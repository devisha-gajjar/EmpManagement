using EmployeeAPI.Entities.DTO.ResponseDto;
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
        // If IP not provided, get server public IP
        if (string.IsNullOrWhiteSpace(ip))
        {
            ip = await ClientIpResolver.GetPublicIpAddressAsync();
        }

        if (string.IsNullOrWhiteSpace(ip))
            return BadRequest("Public IP could not be determined");

        // Geo lookup
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

    [HttpPost("coordinates")]
    public IActionResult ReceiveCoordinates([FromBody] GeoCoordinateDto dto)
    {
        // For now: just log or return it back
        return Ok(new
        {
            latitude = dto.Latitude,
            longitude = dto.Longitude
        });
    }

}
