using MovieStreaming.API.Data;
using MovieStreaming.API.Models;
using Microsoft.AspNetCore.Mvc;
using MovieStreaming.API.Filters;

namespace MovieStreaming.API.Controllers
{
    [ApiController] //api oldugunu belirten bir attribute. Bu attribute, sinifin bir web API'si oldugunu belirtir ve HTTP isteklerini islemek icin gerekli olan temel fonksiyonlari saglar.
    [Route("api/[controller]")] //bu attribute, sinifin hangi URL yoluna cevap verecegini belirtir. [controller] ifadesi, sinifin adini temsil eder ve bu sayede URL yolunu dinamik olarak olusturur. Ornegin, MovieController sinifi icin URL yolu "api/movie" olur.
    public class MovieController : ControllerBase
    {
        [LogAspect]
        [HttpGet]
        public IActionResult GetAll()
        {
            //throw new Exception("Sistem cökme testi! Middleware calısıyor mu?");
            //sistemi bilerek pattığımız deney 
            if (DummyDataStore.Movies == null || !DummyDataStore.Movies.Any())
            {
                return NotFound("No movies found.");
            }
            return Ok(DummyDataStore.Movies);
        }
    }
}