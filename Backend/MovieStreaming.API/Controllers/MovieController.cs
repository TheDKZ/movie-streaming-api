using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Include ve veritabanı sorguları için eklendi
using MovieStreaming.API.Data;
using MovieStreaming.API.Filters;

namespace MovieStreaming.API.Controllers
{
    [Authorize]
    [ApiController] //api oldugunu belirten bir attribute. Bu attribute, sinifin bir web API'si oldugunu belirtir ve HTTP isteklerini islemek icin gerekli olan temel fonksiyonlari saglar.
    [Route("api/[controller]")] //bu attribute, sinifin hangi URL yoluna cevap verecegini belirtir. [controller] ifadesi, sinifin adini temsil eder ve bu sayede URL yolu dinamik olarak olusturur. Ornegin, MovieController sinifi icin URL yolu "api/movie" olur.
    public class MovieController : ControllerBase
    {
        private readonly VodDbContext _context;

        // VodDbContext'i dependency injection ile içeri alıyoruz
        public MovieController(VodDbContext context)
        {
            _context = context;
        }

        [LogAspect]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Asenkron ve izlemesiz (AsNoTracking) sorgu ile Supabase bağlantı kopmalarını önlüyoruz
                var movies = await _context.Movies
                    .AsNoTracking()
                    .Include(m => m.Cast) // Eğer filmlerle birlikte oyuncular da gelsin istersen
                    .ToListAsync();

                if (movies == null || !movies.Any())
                {
                    return NotFound("No movies found.");
                }

                return Ok(movies);
            }
            catch (Exception ex)
            {
                // Olası bir Supabase timeout veya ağ kopmasında sistemin çökmesini engelliyoruz
                return StatusCode(500, new { message = "Veritabanı bağlantı hatası oluştu.", details = ex.Message });
            }
        }
    }
}