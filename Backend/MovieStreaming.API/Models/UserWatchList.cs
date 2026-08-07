using System;

namespace MovieStreaming.API.Models
{
    public class UserWatchlist
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}