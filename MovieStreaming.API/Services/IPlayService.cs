namespace MovieStreaming.API.Services
{
    public interface IPlayService
    {// hangi kullanci hangi icerigi izleyebilir onu kontrol etmek icin kullanıyoruz.
        string GetVideoUrl(int contentId, int userId);
    }
}
