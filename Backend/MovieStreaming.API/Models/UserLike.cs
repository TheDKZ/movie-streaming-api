using System;

namespace MovieStreaming.API.Models // Kendi projenin namespace'ine göre ayarla
{
    public class UserLike
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}