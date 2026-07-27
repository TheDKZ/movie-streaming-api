// AuthService.cs
using Microsoft.IdentityModel.Tokens;
using MovieStreaming.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService : IAuthService
{
    public string GenerateToken(string username, string password)
    {
        if (username == "admin" && password == "12345")
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("SuperGizliVeCokUzunBirSifreGerekiyor123!");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, "1"),
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = "Digiturk_VOD_API",
                Audience = "Digiturk_Users",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token); // uretilen token'i string olarak geri yolla
        }

        // Kullanici adi/sifre yanlissa null don
        return null;
    }
}