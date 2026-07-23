namespace MovieStreaming.API.Services
{
    public class PlayService : IPlayService
    {
        public string GetVideoUrl(int contentId, int userId)
        {
            // Neden kullanıyoruz: Veritabanına gidip "Bu içeriği izleme yetkisi var mı?",
            // "Aboneliği devam ediyor mu?" kontrolleri burada yapılır. 
            // Şimdilik veritabanına bağlanmış gibi yapıp güvenli bir CDN linki üretiyoruz.

            string secureToken = Guid.NewGuid().ToString(); // Sahte bir güvenlik token'ı ürettik

            return $"https://cdn.projen.com/stream/v1/content_{contentId}?user={userId}&token={secureToken}";
        }
    }
}
