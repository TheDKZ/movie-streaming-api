using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Include ve veritabanı sorguları için eklendi
using Microsoft.Extensions.Caching.Memory;
using MovieStreaming.API.Data;
using MovieStreaming.API.Filters; // LogAspect kütüphanesini ekledik

namespace MovieStreaming.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly VodDbContext _context; // Supabase bağlantısı için eklendi

        public CategoryController(IMemoryCache cache, VodDbContext context)
        {
            _cache = cache;
            _context = context;
        }

        /// <summary>
        /// Sistemdeki tüm film kategorilerini listeler. Ön yüzdeki (Frontend) ana sayfa kategori menüsünü doldurmak için bu servis kullanılır.
        /// </summary>
        /// <returns>Kategori listesi ve durum kodu döndürür.</returns>
        [LogAspect]
        [HttpGet("{categoryName}")]
        public IActionResult GetCategoryName(string categoryName)
        {
            // 1. HAFIZADA ARAYACAĞIMIZ ANAHTAR KELİME
            string cacheKey = $"CategoryData_{categoryName}";

            // 2. HAFIZAYI KONTROL EDİYORUZ
            if (_cache.TryGetValue(cacheKey, out var cachedCategory))
            {
                // Bulursa direkt RAM'den (hafızadan) dönüyor
                return Ok(cachedCategory);
            }

            // 3. HAFIZADA YOKSA VERİTABANINA GİDİYORUZ
            Console.WriteLine(">>> DİKKAT: Veri RAM'de bulunamadı, Veritabanına gidiliyor! <<<");
            //sistemi test amaclı yavaslatmak icin kullandım caching test 
            //System.Threading.Thread.Sleep(3000);

            // Verileri artık doğrudan Supabase'den, ilişkili aktörleriyle birlikte çekiyoruz
            var category = _context.Movies
                .Include(m => m.Cast)
                .Where(m => m.Category.ToLower() == categoryName.ToLower())
                .ToList();

            if (!category.Any())
            {
                return NotFound("Category not found.");
            }

            // 4. VERİTABANINDAN BULDUĞUMUZU BİR DAHAKİNE HATIRLAMAK İÇİN HAFIZAYA YAZIYORUZ
            _cache.Set(cacheKey, category, TimeSpan.FromMinutes(5));

            return Ok(category);
        }

        /// <summary>
        /// Benzersiz kimlik numarasına (ID) göre spesifik bir kategorinin/filmin detaylarını getirir.
        /// </summary>
        /// <param name="id">Aranacak kaydın benzersiz kimlik numarası</param>
        [LogAspect]
        [HttpGet("{id:int}")]
        public IActionResult GetCategoryById(int id)
        {
            // Supabase veritabanından ID'ye göre filmi ve oyuncularını çekiyoruz
            var movie = _context.Movies
                .Include(m => m.Cast)
                .FirstOrDefault(m => m.Id == id);

            if (movie == null)
            {
            Name: return NotFound("Movie not found.");
            }
            return Ok(movie);
        }
    }
}