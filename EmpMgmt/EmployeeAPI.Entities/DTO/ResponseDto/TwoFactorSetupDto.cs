namespace EmployeeAPI.Entities.DTO.ResponseDto;

public class TwoFactorSetupDto
{
    public string Secret { get; set; } = default!;
    public string QrCodeUri { get; set; } = default!;
    /// Issuer name (shown in Authenticator app)
    /// Example: EmployeeApp
    public string Issuer { get; set; } = default!;
    /// Account identifier (usually email or username)
    /// Example: john.doe@company.com
    public string Account { get; set; } = default!;
}