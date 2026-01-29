using System.Text.Json;

namespace EmployeeAPI.Entities.Helper;

public static class JsonExtensions
{
    public static string? GetPropertyOrNull(
        this JsonElement element,
        string propertyName)
    {
        return element.TryGetProperty(propertyName, out var value)
            ? value.GetString()
            : null;
    }
}
