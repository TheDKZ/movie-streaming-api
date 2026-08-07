using Microsoft.IdentityModel.Tokens;
using MovieStreaming.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MovieStreaming.API.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;

namespace MovieStreaming.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly VodDbContext _context;

        // Hafızada geçici olarak sıfırlama kodlarını tutmak için sözlük (Dictionary)
        private static readonly Dictionary<string, string> ResetCodes = new Dictionary<string, string>();

        public AuthService(VodDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateTokenAsync(string username, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == username && u.Password == password);

            if (user != null)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes("SuperGizliVeCokUzunBirSifreGerekiyor123!");

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Email)
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    Issuer = "Digiturk_VOD_API",
                    Audience = "Digiturk_Users",
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }

            return null;
        }

        public async Task<object> GetUserProfileAsync(int userId)
        {
            // Veritabanından o anki kullanıcıyı buluyoruz
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return null;

            // Şifreyi GİZLEYEREK sadece ekranda lazım olan bilgileri gönderiyoruz
            return new
            {
                Id = user.Id,
                Name = user.FullName,
                Email = user.Email
            };
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            // 1. Kullanıcıyı veritabanında bul
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return false; // Kullanıcı zaten yoksa false dön

            // 2. Kullanıcıyı tablodan uçur
            _context.Users.Remove(user);

            // 3. Değişiklikleri Supabase'e kaydet
            await _context.SaveChangesAsync();

            return true;
        }

        // --- ŞİFRE DEĞİŞTİRME METODU (İÇERİDEN) ---
        public async Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);

            // Kullanıcı yoksa veya girdiği "Eski Şifre" veritabanındakiyle uyuşmuyorsa işlemi reddet
            if (user == null || user.Password != oldPassword)
            {
                return false;
            }

            // Şifreyi yenisiyle güncelle ve kaydet
            user.Password = newPassword;
            await _context.SaveChangesAsync();

            return true;
        }

        // --- 1. ADIM: MAİL İLE DOĞRULAMA KODU GÖNDERME (SMTP) ---
        public async Task<bool> SendPasswordResetEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return false; // E-posta veritabanında kayıtlı değilse

            // 6 haneli rastgele bir doğrulama kodu üretelim
            var random = new Random();
            string resetCode = random.Next(100000, 999999).ToString();

            // Kodu hafızaya kaydedelim
            ResetCodes[email] = resetCode;

            try
            {
                // Gmail SMTP Ayarları (Merkez mail ve şifre entegre edildi)
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("dkaanfb03@gmail.com", "himbbdkrudmglyqi"),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("dkaanfb03@gmail.com", "MovieStreaming VOD"),
                    Subject = "Şifre Sıfırlama Doğrulama Kodun",
                    Body = $"Merhaba,\n\nŞifreni sıfırlamak için talepte bulundun. Doğrulama kodun:\n\n{resetCode}\n\nBu kodu uygulama ekranına girerek yeni şifreni belirleyebilirsin.",
                    IsBodyHtml = false,
                };

                mailMessage.To.Add(email);
                await smtpClient.SendMailAsync(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Mail gönderme hatası: " + ex.Message);
                return false;
            }
        }

        // --- 2. ADIM: KODU DOĞRULAYIP YENİ ŞİFREYİ KAYDETME ---
        public async Task<bool> VerifyAndResetPasswordAsync(string email, string code, string newPassword)
        {
            // Kod hafızada var mı ve doğru mu kontrol et
            if (ResetCodes.TryGetValue(email, out var savedCode) && savedCode == code)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user != null)
                {
                    user.Password = newPassword;
                    await _context.SaveChangesAsync();

                    // İşlem bittiği için kodu hafızadan siliyoruz
                    ResetCodes.Remove(email);
                    return true;
                }
            }
            return false;
        }

        // --- KAYIT OLMA METODU ---
        public async Task<bool> RegisterAsync(string name, string email, string password)
        {
            // 1. Adım: Bu e-posta ile kayıtlı başka bir kullanıcı var mı kontrol et
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (existingUser != null)
            {
                return false; // Aynı e-posta varsa kaydı reddet
            }

            // 2. Adım: Yeni kullanıcıyı oluştur
            var newUser = new MovieStreaming.API.Models.User
            {
                FullName = name,
                Email = email,
                Password = password
            };

            // 3. Adım: Supabase veritabanına ekle ve kaydet
            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}