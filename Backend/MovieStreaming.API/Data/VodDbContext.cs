using Microsoft.EntityFrameworkCore;
using MovieStreaming.API.Models;

namespace MovieStreaming.API.Data
{
    public class VodDbContext : DbContext
    {
        public VodDbContext(DbContextOptions<VodDbContext> options) : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Actor> Actors { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserLike> UserLikes { get; set; }
        public DbSet<UserWatchlist> UserWatchlists { get; set; }
    }
}