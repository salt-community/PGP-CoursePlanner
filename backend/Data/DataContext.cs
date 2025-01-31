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
        public DbSet<CourseModule> CourseModules { get; set; }
        public DbSet<CalendarDate> CalendarDates { get; set; }
        public DbSet<DateContent> DateContent { get; set; }
        public DbSet<LoggedInUser> LoggedInUser { get; set; }
        public DbSet<Track> Tracks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuring the many-to-many relationship
            modelBuilder.Entity<CourseModule>()
                .HasKey(cm => new { cm.CourseId, cm.ModuleId });

            modelBuilder.Entity<CourseModule>()
                .HasOne(cm => cm.Course)
                .WithMany(c => c.Modules)
                .HasForeignKey(cm => cm.CourseId);

            modelBuilder.Entity<CourseModule>()
                .HasOne(cm => cm.Module)
                .WithMany(m => m.CourseModules)
                .HasForeignKey(cm => cm.ModuleId);

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