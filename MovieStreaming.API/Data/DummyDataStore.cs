using MovieStreaming.API.Models;

namespace MovieStreaming.API.Data
{
    public static class DummyDataStore
    {
        public static List<Movie> Movies = new List<Movie>
        {
            new Movie
            {
                Id = 1,
                Title = "Transformers",
                Category = "Action",
                Description = "A science fiction action film based on the Transformers toy line.",
                VideoUrl = "https://www.youtube.com/watch?v=CbX_SIz_9fk",
            },
            new Movie
            {
                Id = 2,
                Title = "The Dark Knight",
                Category = "Action",
                Description = "A superhero film based on the DC Comics character Batman.",
                VideoUrl = "https://www.youtube.com/watch?v=EXeTwQWrcwY",


            },
            new Movie
            {
                Id = 3,
                Title = "Inception",
                Category = "Science Fiction",
                Description = "A science fiction action film that explores the concept of dream invasion.",
                VideoUrl = "https://www.youtube.com/watch?v=YoHD9XEInc0",
            },

        };

    }

}