using System.Threading.Tasks;

namespace MovieStreaming.API.Services
{
    public interface IAuthService
    {
        Task<string> GenerateTokenAsync(string username, string password);

        // Frontend'den gelen Ad, E-Posta ve Şifre bilgilerini alacak yeni metodumuz
        Task<bool> RegisterAsync(string name, string email, string password);
        // Token'daki ID'ye göre kullanıcı bilgilerini getirecek metod
        Task<object> GetUserProfileAsync(int userId);
        // Kullanıcının kendi hesabını silmesi için metod
        Task<bool> DeleteUserAsync(int userId);
        // Kullanıcının şifresini değiştirmesi için metod
        Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
        Task<bool> SendPasswordResetEmailAsync(string email);
        Task<bool> VerifyAndResetPasswordAsync(string email, string code, string newPassword);

    }
}