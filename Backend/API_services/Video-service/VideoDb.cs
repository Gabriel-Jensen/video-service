using Microsoft.EntityFrameworkCore;
public class VideoDb : DbContext
{
    public VideoDb(DbContextOptions<VideoDb> options) : base(options) { }
    public DbSet<Video> Videos => Set<Video>();

    public VideoDb()
    {

    }
}