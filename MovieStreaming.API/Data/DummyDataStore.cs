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
            new Movie
            {
                Id = 4,
                Title = "The Matrix",
                Category = "Science Fiction",
                Description = "A science fiction action film that explores the nature of reality.",
                VideoUrl = "https://www.youtube.com/watch?v=vKQi3bBA1y8",
            },
            new Movie
            {
                Id = 5,
                Title = "The Godfather",
                Category = "Crime",
                Description = "A crime film that chronicles the Corleone family under patriarch Vito Corleone.",
                VideoUrl = "https://www.youtube.com/watch?v=sY1S34973zA",
            },
            new Movie
            {
                Id = 6,
                Title = "Pulp Fiction",
                Category = "Crime",
                Description = "A crime film that interweaves multiple storylines involving Los Angeles mobsters.",
                VideoUrl = "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
            },
            new Movie
            {
                Id = 7,
                Title = "The Shawshank Redemption",
                Category = "Drama",
                Description = "A drama film that tells the story of a banker sentenced to life in Shawshank State Penitentiary.",
                VideoUrl = "https://www.youtube.com/watch?v=6hB3S9bIaco",
            },
            new Movie
            {
                Id = 8,
                Title = "Forrest Gump",
                Category = "Drama",
                Description = "A drama film that follows the life of Forrest Gump, a man with a low IQ.",
                VideoUrl = "https://www.youtube.com/watch?v=OnHJ2L04350",
            },
            new Movie
            {
                Id = 9,
                Title = "The Lion King",
                Category = "Animation",
                Description = "An animated musical film that tells the story of a young lion prince named Simba.",
                VideoUrl = "https://www.youtube.com/watch?v=4sj1MT05lAA",
            },
            new Movie
            {
                Id = 10,
                Title = "Finding Nemo",
                Category = "Animation",
                Description = "An animated adventure film that follows the journey of a clownfish named Marlin.",
                VideoUrl = "https://www.youtube.com/watch?v=wZdpNglLbt8",
            },
            new Movie
            {
                Id = 11,
                Title = "The Conjuring",
                Category = "Horror",
                Description = "A horror film that follows paranormal investigators Ed and Lorraine Warren.",
                VideoUrl = "https://www.youtube.com/watch?v=k10ETZ41q5o",
            },
            new Movie
            {
                Id = 12,
                Title = "Get Out",
                Category = "Horror",
                Description = "A horror film that explores racial tensions and social commentary.",
                VideoUrl = "https://www.youtube.com/watch?v=DzfpyUB60YY",
            },
            new Movie
            {
                Id = 13,
                Title = "The Hangover",
                Category = "Comedy",
                Description = "A comedy film that follows a group of friends who lose the groom during a bachelor party in Las Vegas.",
                VideoUrl = "https://www.youtube.com/watch?v=tcdUhdOlz9M",
            },
        };

    }

}