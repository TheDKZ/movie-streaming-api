using System.ComponentModel.DataAnnotations;

namespace MovieStreaming.API.Models
{
    public class Actor
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public string CharacterName { get; set; }
        public string ImageUrl { get; set; }
    }
}