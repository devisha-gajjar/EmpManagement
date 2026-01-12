using System.Text.Json;

namespace EmployeeAPI.Entities.Helper;

public static class ClientIpResolver
{
    public static async Task<string?> GetPublicIpAddressAsync()
    {
        using HttpClient client = new();

        try
        {
            var response = await client.GetStringAsync("https://api.ipify.org?format=json");

            using var doc = JsonDocument.Parse(response);
            return doc.RootElement.GetProperty("ip").GetString();
        }
        catch
        {
            return null;
        }
    }
}
