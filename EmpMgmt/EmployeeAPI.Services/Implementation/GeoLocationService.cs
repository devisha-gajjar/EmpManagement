using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Services.IServices;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Exceptions;
using MaxMind.GeoIP2.Responses;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace EmployeeAPI.Services.Implementation;

public class GeoLocationService : IGeoLocationService
{
    private readonly DatabaseReader _reader;
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;
    private readonly string _defaultIndiaIp;

    public GeoLocationService(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;

        _defaultIndiaIp =
            _config["GeoSettings:MockIndiaIp"]
            ?? throw new AppException("GeoSettings:MockIndiaIp is missing");

        var dbPath = Path.Combine(
            env.ContentRootPath,
            "GeoIP",
            "GeoLite2-Country.mmdb"
        );

        if (!File.Exists(dbPath))
            throw new AppException("GeoIP database not found");

        _reader = new DatabaseReader(dbPath);
    }

    public CountryResponse? GetCountryByIp(string ipAddress)
    {
        if (!IPAddress.TryParse(ipAddress, out var ip))
            return null;

        // // 🔹 Handle private / localhost IPs
        // if (IsPrivateIp(ip))
        // {
        //     // In dev, fallback to India IP
        //     if (_env.IsDevelopment())
        //     {
        //         ip = IPAddress.Parse(DefaultIndiaIp);
        //     }
        //     else
        //     {
        //         // In prod, do not fake geo
        //         return null;
        //     }
        // }

        try
        {
            return _reader.Country(ip);
        }
        catch (AddressNotFoundException)
        {
            return null;
        }
    }

    private static bool IsPrivateIp(IPAddress ip)
    {
        if (IPAddress.IsLoopback(ip))
            return true;

        var bytes = ip.GetAddressBytes();

        return bytes[0] == 10 ||
               (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) ||
               (bytes[0] == 192 && bytes[1] == 168);
    }
}
