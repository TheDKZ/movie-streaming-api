using Microsoft.AspNetCore.Mvc;
using MovieStreaming.API.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MovieStreaming.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // --- MODELLER --- //
        public class LoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class RegisterModel
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class ChangePasswordModel
        {
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }

        // YENİ EKLENEN MODELLER: Gerçek Mail Kodlu Şifre Sıfırlama
        public class SendCodeModel
        {
            public string Email { get; set; }
        }

        public class VerifyAndResetModel
        {
            public string Email { get; set; }
            public string Code { get; set; }
            public string NewPassword { get; set; }
        }

        // --- ENDPOINT'LER --- //

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Asenkron çağrıyı await ile bekliyoruz
            var tokenString = await _authService.GenerateTokenAsync(model.Email, model.Password);

            if (tokenString != null)
            {
                return Ok(new { token = tokenString });
            }

            return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı!" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // Burada AuthService üzerinden veritabanına kayıt işlemi yapıyoruz.
            var isRegistered = await _authService.RegisterAsync(model.Name, model.Email, model.Password);

            if (isRegistered)
            {
                return Ok(new { message = "Hesap başarıyla oluşturuldu." });
            }

            return BadRequest(new { message = "Kayıt başarısız oldu. Bu e-posta adresi zaten kullanımda olabilir." });
        }

        // --- PROFİL GETİRME ENDPOINT'İ --- //

        [Authorize] // Sadece geçerli bir token'ı olanlar bu kapıdan girebilir!
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            // Token'ın içinden kullanıcının ID'sini cımbızla çekiyoruz
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized(new { message = "Kimlik doğrulanamadı." });

            var userId = int.Parse(userIdString);

            // AuthService'e gidip veritabanından adımızı ve e-postamızı alıyoruz
            var userProfile = await _authService.GetUserProfileAsync(userId);

            if (userProfile == null)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            return Ok(userProfile);
        }

        // --- HESAP SİLME ENDPOINT'İ --- //

        [Authorize] // Sadece token'ı olan, yani giriş yapmış kişi bu kapıyı çalabilir!
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteMyProfile()
        {
            // Token'ın içinden "kim bu adam?" diyerek ID'sini alıyoruz
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized(new { message = "Kimlik doğrulanamadı." });

            var userId = int.Parse(userIdString);

            // AuthService'e "Bu ID'li arkadaşı veritabanından tamamen sil" diyoruz
            var result = await _authService.DeleteUserAsync(userId);

            if (!result)
                return BadRequest(new { message = "Hesap silinirken bir hata oluştu veya kullanıcı bulunamadı." });

            return Ok(new { message = "Hesabın başarıyla ve kalıcı olarak silindi." });
        }

        // --- ŞİFRE DEĞİŞTİRME ENDPOINT'İ --- //

        [Authorize] // Sadece token'ı olan, yani giriş yapmış kişi bu kapıyı çalabilir!
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized(new { message = "Kimlik doğrulanamadı." });

            var userId = int.Parse(userIdString);

            var isChanged = await _authService.ChangePasswordAsync(userId, model.OldPassword, model.NewPassword);

            if (!isChanged)
            {
                return BadRequest(new { message = "Mevcut şifreniz hatalı!" });
            }

            return Ok(new { message = "Şifreniz başarıyla güncellendi." });
        }

        // --- 1. ADIM: MAİLE DOĞRULAMA KODU GÖNDERME ---
        [HttpPost("send-reset-code")]
        public async Task<IActionResult> SendResetCode([FromBody] SendCodeModel model)
        {
            var isSent = await _authService.SendPasswordResetEmailAsync(model.Email);

            if (!isSent)
            {
                return BadRequest(new { message = "Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı veya mail gönderilemedi." });
            }

            return Ok(new { message = "Doğrulama kodu e-posta adresinize gönderildi." });
        }

        // --- 2. ADIM: KODU DOĞRULAYIP ŞİFREYİ GÜNCELLEME ---
        [HttpPost("verify-and-reset")]
        public async Task<IActionResult> VerifyAndReset([FromBody] VerifyAndResetModel model)
        {
            var isReset = await _authService.VerifyAndResetPasswordAsync(model.Email, model.Code, model.NewPassword);

            if (!isReset)
            {
                return BadRequest(new { message = "Doğrulama kodu hatalı veya süresi dolmuş." });
            }

            return Ok(new { message = "Şifreniz başarıyla güncellendi." });
        }
    }
}