using EmployeeAPI.Entities.DTO;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using OtpNet;

namespace EmployeeAPI.Services.Implementation;

public class TwoFactorService(IGenericRepository<User> userRepository) : ITwoFactorService
{
    public string GenerateSecret()
    {
        var key = KeyGeneration.GenerateRandomKey(20);
        return Base32Encoding.ToString(key);
    }

    public string GenerateQrUri(string email, string secret)
    {
        return $"otpauth://totp/EmployeeAPI:{email}?secret={secret}&issuer=EmployeeAPI&digits=6";
    }

    public bool ValidateCode(string secret, string code)
    {
        var totp = new Totp(Base32Encoding.ToBytes(secret));
        return totp.VerifyTotp(
            code,
            out _,
            VerificationWindow.RfcSpecifiedNetworkDelay
        );
    }

    public TwoFactorSetupDto Generate2FASetup(int userId)
    {
        var user = userRepository.GetById(userId) ?? throw new AppException(Constants.USER_NOT_FOUND);

        if (user.IsTwoFactorEnabled)
            throw new AppException("2FA already enabled");

        var secretKey = KeyGeneration.GenerateRandomKey(20);
        var base32Secret = Base32Encoding.ToString(secretKey);

        var issuer = "EmployeeApp";
        var label = $"{issuer}:{user.Email}";

        var otpAuthUrl =
            $"otpauth://totp/{Uri.EscapeDataString(label)}" +
            $"?secret={base32Secret}&issuer={issuer}&digits=6";

        // TEMP store secret until verification
        user.TwoFactorSecret = base32Secret;
        userRepository.Update(user);

        return new TwoFactorSetupDto
        {
            Secret = base32Secret,
            QrCodeUri = otpAuthUrl
        };
    }

}