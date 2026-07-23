using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MovieStreaming.API.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- 1. ARAÇ ÇANTASI (SERVICES) ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IPlayService, PlayService>();
// Çakışma yaratan kilit butonunu temizledik, standart Swagger aktif
builder.Services.AddSwaggerGen();
// Ne işe yarar: Herhangi bir sınıf IAuthService talep ettiğinde, ona bir AuthService nesnesi üretip yollar.
builder.Services.AddScoped<IAuthService, AuthService>();
// Uygulamaya hafıza (Cache) tahsis ediyoruz
builder.Services.AddMemoryCache();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "Digiturk_VOD_API",
            ValidAudience = "Digiturk_Users",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SuperGizliVeCokUzunBirSifreGerekiyor123!"))
        };
    });

var app = builder.Build();

// --- 2. BORU HATTI (PIPELINE) ---
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MovieStreaming API V1");
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Senin yazdığın merkezi hata yönetim tüneli
app.UseMiddleware<MovieStreaming.API.Middlewares.ExceptionMiddleware>();
app.MapControllers();

app.Run();