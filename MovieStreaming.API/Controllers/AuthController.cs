// AuthController.cs
using Microsoft.AspNetCore.Mvc;
using MovieStreaming.API.Services;

namespace MovieStreaming.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // 1. Dependency Injection için özel alan
        private readonly IAuthService _authService;

        // 2. Yapıcı Metot (Constructor). .NET sistemi çalışırken bize bir AuthService nesnesi enjekte edecek.
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        public class LoginModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // 3. Bütün o karmaşık kodlar yerine sadece servisi çağırıyoruz!
            var tokenString = _authService.GenerateToken(model.Username, model.Password);

            if (tokenString != null)
            {
                // Giriş başarılı, token'ı yolla
                return Ok(new { Token = tokenString });
            }

            // Servis null döndüyse giriş başarısızdır
            return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı!" });
        }
    }
}