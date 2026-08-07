using System.ComponentModel.DataAnnotations;

namespace MovieStreaming.API.Models
{
    public class Movie
    {
        public string Title { get; set; }

        [Key]
        public int Id { get; set; }

        public string Category { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public string ImageUrl { get; set; }

        public double ImdbRating { get; set; } // Puan (Örn: 7.8)
        public string Duration { get; set; }   // Süre (Örn: "2s 24dk")
        public string Director { get; set; }   // Yönetmen (Örn: "Michael Bay")
        public string AgeRating { get; set; }  // Yaş Rozeti (Örn: "13+")
        public List<Actor> Cast { get; set; } = new List<Actor>();
        public List<string> Descriptors { get; set; } = new List<string>();
    }
}