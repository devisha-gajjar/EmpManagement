using EmployeeAPI.Services.IServices;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Exceptions;
using MaxMind.GeoIP2.Responses;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Net;

namespace EmployeeAPI.Services.Implementation;

public class GeoLocationService : IGeoLocationService
{
    private readonly DatabaseReader _reader;
    private readonly IWebHostEnvironment _env;

    private const string DefaultIndiaIp = "49.37.128.112";

    public GeoLocationService(IWebHostEnvironment env)
    {
        _env = env;

        var dbPath = Path.Combine(env.ContentRootPath, "GeoIP", "GeoLite2-Country.mmdb");
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
