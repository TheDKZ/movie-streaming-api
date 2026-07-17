namespace MovieStreaming.API.Models
{
    public class Movie
    {
        public string Title { get; set; }
        public int Id { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
    }
}