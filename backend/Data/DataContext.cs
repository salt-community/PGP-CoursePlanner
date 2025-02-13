using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Course> Courses { get; set; } //This is both active and inactive courses
        public DbSet<Module> Modules { get; set; } //This is both active and inactive modules
        public DbSet<Day> Days { get; set; } //This is both active and inactive days
        public DbSet<Event> Events { get; set; } //this is both active and inactive events
        public DbSet<CalendarDate> CalendarDates { get; set; }
        public DbSet<DateContent> DateContent { get; set; }
        public DbSet<LoggedInUser> LoggedInUser { get; set; }
        public DbSet<Track> Tracks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Course>()
                .HasMany(c => c.Modules)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "CourseModule",
                    j => j.HasOne<Module>().WithMany().HasForeignKey("ModuleId"),
                    j => j.HasOne<Course>().WithMany().HasForeignKey("CourseId")
                );

            modelBuilder.Entity<Module>()
                .HasMany(m => m.Tracks)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "ModuleTrack",
                    j => j.HasOne<Track>().WithMany().HasForeignKey("TrackId"),
                    j => j.HasOne<Module>().WithMany().HasForeignKey("ModuleId")
                );
        }
    }
}