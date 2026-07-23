// PlayController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieStreaming.API.Services;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController] // Ne işe yarar: Bu sınıfın bir API controller olduğunu ve otomatik veri doğrulama (validation) yapacağını .NET'e söyler.
public class PlayController : ControllerBase
{
    private readonly IPlayService _playService;

    // Neden kullanıyoruz: Dependency Injection (Bağımlılık Enjeksiyonu). 
    // New anahtar kelimesiyle kendimiz nesne üretmeyiz, .NET bizim için üretip buraya yollar.
    public PlayController(IPlayService playService)
    {
        _playService = playService;
    }

    [Authorize] // EN ÖNEMLİ KISIM! Ne işe yarar: Bu metoda sadece geçerli bir JWT (bilet) ile gelenler girebilir. Bileti olmayan anında 401 hatası yer.
    [HttpGet("{contentId}")] // Ne işe yarar: URL'den (örneğin /api/play/5) gelen 5 rakamını contentId parametresine bağlar.
    public IActionResult Play(int contentId)
    {
        // Neden kullanıyoruz: Güvenlik görevlisini (Authorize) geçen biletin içinden, 
        // kişinin Kimliğini (ID) çekip çıkarıyoruz. (Dün JWT üretirken NameIdentifier içine user id koymuştuk).
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized("Geçerli bir token var ama içinde kullanıcı kimliği bulunamadı.");
        }

        // Biletin içindeki ID metin (string) olarak gelir, onu tam sayıya (int) çeviriyoruz.
        int userId = int.Parse(userIdClaim.Value);

        // Ne işe yarar: Artık kimliğini bildiğimiz kullanıcıyı, iş mantığını yapması için Servis katmanına yolluyoruz.
        var videoUrl = _playService.GetVideoUrl(contentId, userId);

        // Neden kullanıyoruz: İşlem başarılı oldu, geriye HTTP 200 (OK) statü koduyla birlikte JSON formatında cevabımızı dönüyoruz.
        return Ok(new
        {
            IsSuccess = true,
            ContentId = contentId,
            StreamUrl = videoUrl,
            Message = "İyi seyirler!"
        });
    }
}