using MovieStreaming.API.Data;
using MovieStreaming.API.Models;
using Microsoft.AspNetCore.Mvc;// Bu bizim sinifimiza bir web sunucusuna donusturecek gucleri getirir.//controllerBase sinifi, HTTP isteklerini islemek icin gerekli olan temel fonksiyonlari saglar. Bu sinif, bir web API'si olusturmak icin kullanilir ve HTTP GET, POST, PUT, DELETE gibi istekleri islemek icin gerekli olan metodlari icerir.

namespace MovieStreaming.API. 
{
     public class CategoryController : ControllerBase
    {
        [HttpGet("{categoryName}")] //Bu metodun sadece tarayıcıdan URL girilerek veya veri okuma amacıyla (GET) çağrılabileceğini belirtir.
        public IActionResult GetCategoryName(string categoryName) // IActionResult Nedir? Neden string veya int dönmüyoruz? Çünkü bir API her zaman iki şey döner: Veri ve HTTP Durum Kodu
        {
            var category = DummyDataStore.Movies.Where(m => m.Category == categoryName).ToList();
            if (!category.Any())
            {
                return NotFound("Category not found.");
            }
            return Ok(category);
        }
        [HttpGet("{id:int}")]
        public IActionResult GetCategoryById(int id)
        {
            var movie = DummyDataStore.Movies.FirstOrDefault(m => m.Id == id);
            if (movie == null)
            {
                return NotFound("Movie not found.");
            }
            return Ok(movie);
        }
    }
}

  