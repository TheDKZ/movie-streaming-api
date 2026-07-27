namespace MovieStreaming.API.Services
{
    public interface IAuthService
    {// Ne ise yarar: Kullanici adi ve sifree ister
        string GenerateToken(string username, string password);
    }
}
