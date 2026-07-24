using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public CategoryController(IMemoryCache cache)
        {
            _cache = cache;
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
            //sistemi test amaclı yavaslatmak icin kullandım caching test System.Threading.Thread.Sleep(3000);
            var category = DummyDataStore.Movies.Where(m => m.Category == categoryName).ToList();
            if (!category.Any())
            {
                return NotFound("Category not found.");
            }

            // 4. VERİTABANINDAN BULDUĞUMUZU BİR DAHAKİNE HATIRLAMAK İÇİN HAFIZAYA YAZIYORUZ
            _cache.Set(cacheKey, category, TimeSpan.FromMinutes(5));

            return Ok(category);
        }
        /// Benzersiz kimlik numarasına (ID) göre spesifik bir kategorinin detaylarını getirir. Ön yüz (Frontend) geliştiricisi belirli bir kategoriye tıklandığında bu servisi kullanmalıdır
        /// <param //name="id">Aranacak kategorinin benzersiz kimlik numarası (Örn: 1)</param>

        [LogAspect]
        [HttpGet("{id:int}")]
        public IActionResult GetCategoryById(int id)
        {
            // Bu metodu şimdilik eski halinde (cachesiz) bırakıyoruz
            var movie = DummyDataStore.Movies.FirstOrDefault(m => m.Id == id);
            if (movie == null)
            {
                return NotFound("Movie not found.");
            }
            return Ok(movie);
        }
    }
}