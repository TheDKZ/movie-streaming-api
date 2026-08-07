using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieStreaming.API.Data; // Kendi DbContext namespace'ine göre ayarla
using MovieStreaming.API.Models; // Kendi Models namespace'ine göre ayarla
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MovieStreaming.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Sadece token'ı olan (giriş yapmış) kullanıcılar işlem yapabilir
    public class UserInteractionController : ControllerBase
    {
        private readonly VodDbContext _context;

        public UserInteractionController(VodDbContext context)
        {
            _context = context;
        }

        // 1. FİLMİ BEĞEN VEYA BEĞENMEKTEN VAZGEÇ (TOGGLE)
        [HttpPost("like/{movieId}")]
        public async Task<IActionResult> ToggleLike(int movieId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var existingLike = await _context.UserLikes
                .FirstOrDefaultAsync(ul => ul.UserId == userId && ul.MovieId == movieId);

            if (existingLike != null)
            {
                // Zaten beğenmişse, beğeniyi geri al (sil)
                _context.UserLikes.Remove(existingLike);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Film beğenilerden çıkarıldı.", isLiked = false });
            }

            // Beğenmemişse yeni beğeni ekle
            var newLike = new UserLike { UserId = userId, MovieId = movieId };
            await _context.UserLikes.AddAsync(newLike);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Film beğenildi.", isLiked = true });
        }

        // 2. FİLMİ LİSTEYE EKLE VEYA LİSTEDEN ÇIKAR (TOGGLE)
        [HttpPost("watchlist/{movieId}")]
        public async Task<IActionResult> ToggleWatchlist(int movieId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var existingWatchlist = await _context.UserWatchlists
                .FirstOrDefaultAsync(uw => uw.UserId == userId && uw.MovieId == movieId);

            if (existingWatchlist != null)
            {
                // Zaten listedeyse, listeden çıkar
                _context.UserWatchlists.Remove(existingWatchlist);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Film listeden çıkarıldı.", inWatchlist = false });
            }

            // Listede yoksa ekle
            var newWatchlist = new UserWatchlist { UserId = userId, MovieId = movieId };
            await _context.UserWatchlists.AddAsync(newWatchlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Film listeye eklendi.", inWatchlist = true });
        }

        // 3. KULLANICININ BEĞENDİĞİ FİLMLERİ GETİR
        [HttpGet("liked-movies")]
        public async Task<IActionResult> GetLikedMovies()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Beğenilen filmlerin ID'leri üzerinden filmleri bulup getiriyoruz
            var likedMovies = await _context.UserLikes
                .Where(ul => ul.UserId == userId)
                .Join(_context.Movies, // DbContext'indeki film tablosunun adı "Movies" varsayılmıştır
                      ul => ul.MovieId,
                      m => m.Id,
                      (ul, m) => m)
                .ToListAsync();

            return Ok(likedMovies);
        }

        // 4. KULLANICININ LİSTESİNDEKİ FİLMLERİ GETİR
        [HttpGet("watchlist")]
        public async Task<IActionResult> GetWatchlist()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var watchlistMovies = await _context.UserWatchlists
                .Where(uw => uw.UserId == userId)
                .Join(_context.Movies,
                      uw => uw.MovieId,
                      m => m.Id,
                      (uw, m) => m) 
                .ToListAsync();

            return Ok(watchlistMovies);
        }
    }
}