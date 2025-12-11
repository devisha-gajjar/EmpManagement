using System.Security.Claims;

namespace EmployeeAPI.Entities.Helper;

public static class ClaimsPrincipalExtensions
{
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        if (user?.Identity is ClaimsIdentity identity)
        {
            var userIdClaim = identity.FindFirst(ClaimTypes.Name);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                return userId;
        }
        return null;
    }
}
