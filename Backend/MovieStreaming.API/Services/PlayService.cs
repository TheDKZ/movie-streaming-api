namespace MovieStreaming.API.Services
{
    public class PlayService : IPlayService
    {
        public string GetVideoUrl(int contentId, int userId)
        {
            // Neden kullanıyoruz: Veritabanına gidip bu icergi izleme yetkisi olup olmadıgıını kontrol etmek için kullanıyoruz.
            string secureToken = Guid.NewGuid().ToString(); // Sahte bir güvenlik token'ı ürettik

            return $"https://cdn.projen.com/stream/v1/content_{contentId}?user={userId}&token={secureToken}";
        }
    }
}
