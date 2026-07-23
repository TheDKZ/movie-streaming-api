using MovieStreaming.API.Data;
using MovieStreaming.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
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

            var category = DummyDataStore.Movies.Where(m => m.Category == categoryName).ToList();
            if (!category.Any())
            {
                return NotFound("Category not found.");
            }

            // 4. VERİTABANINDAN BULDUĞUMUZU BİR DAHAKİNE HATIRLAMAK İÇİN HAFIZAYA YAZIYORUZ
            _cache.Set(cacheKey, category, TimeSpan.FromMinutes(5));

            return Ok(category);
        }

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