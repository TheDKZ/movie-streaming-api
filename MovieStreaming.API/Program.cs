using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using MovieStreaming.API.Services;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// insacı nesne olusturur

// ----------------------------------------------------
// SERILOG AYARLARI
// ----------------------------------------------------
// Logları hem konsola hem de Logs klasörünün içine
// gün gün metin dosyası olarak yaz.
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day) // yeni log dosyası
    .CreateLogger();

builder.Host.UseSerilog(); // benim kurdugum log ayarlarını kullan

// ----------------------------------------------------
// 1. ARAÇ ÇANTASI (SERVICES)
// ----------------------------------------------------

// API Controllerlarını kullanabilmek için gerekli servisleri ekler.
builder.Services.AddControllers();

// Swagger için gerekli servisleri ekler.
builder.Services.AddEndpointsApiExplorer();

// PlayService Dependency Injection
builder.Services.AddScoped<IPlayService, PlayService>();

// AuthService Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();

// Uygulamaya hafıza (Cache) tahsis ediyoruz.
builder.Services.AddMemoryCache();

// ----------------------------------------------------
// SWAGGER AYARLARI
// ----------------------------------------------------
builder.Services.AddSwaggerGen(c =>
{
    // XML açıklamalarını Swagger'a ekler.
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

    c.IncludeXmlComments(xmlPath);

    // ------------------------------------------------
    // SWAGGER TOKEN (AUTHORIZE) VE HEADER AYARLARI
    // ------------------------------------------------
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Örnek: 'Bearer {token}'",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    // Swagger'da Authorize butonunu aktif eder.
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

// ----------------------------------------------------
// JWT AUTHENTICATION
// ----------------------------------------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Token'daki issuer kontrol edilir.
            ValidateIssuer = true,

            // Token'daki audience kontrol edilir.
            ValidateAudience = true,

            // Token süresi dolmuş mu kontrol edilir.
            ValidateLifetime = true,

            // İmza doğrulaması yapılır.
            ValidateIssuerSigningKey = true,

            // Token üreticisi
            ValidIssuer = "Digiturk_VOD_API",

            // Token kullanıcı kitlesi
            ValidAudience = "Digiturk_Users",

            // Gizli anahtar
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("SuperGizliVeCokUzunBirSifreGerekiyor123!"))
        };
    });

// ----------------------------------------------------
// 2. BORU HATTI (PIPELINE)
// ----------------------------------------------------
var app = builder.Build();

// Swagger JSON oluşturur.
app.UseSwagger();

// Swagger arayüzünü açar.
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MovieStreaming API V1");
    c.RoutePrefix = string.Empty;
});

// HTTP isteklerini HTTPS'e yönlendirir.
app.UseHttpsRedirection();

// Kimlik doğrulama
app.UseAuthentication();

// Yetkilendirme
app.UseAuthorization();

// Merkezi hata yönetim tüneli
app.UseMiddleware<MovieStreaming.API.Middlewares.ExceptionMiddleware>();

// Controllerları eşleştirir.
app.MapControllers();

// Uygulamayı başlatır.
app.Run();