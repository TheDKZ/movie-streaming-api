namespace MovieStreaming.API.Services
{
    public interface IAuthService
    {// Ne işe yarar: Kullanıcı adı ve şifreyi alıp, başarılıysa Token metnini, başarısızsa null dönecek şablon.
        string GenerateToken(string username, string password);
    }
}
