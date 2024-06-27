// using Backend.Models;
// using Microsoft.EntityFrameworkCore;

// namespace Backend.Data
// {
//     public class DataContext : DbContext
//     {
//         public DataContext(DbContextOptions<DataContext> options) : base(options)
//         {
//         }

//         public DbSet<Course> Courses {get; set;}
//         public DbSet<Module> Modules {get; set;}
//         public DbSet<Day> Days {get; set;}
//         public DbSet<Event> Events {get; set;}
//     }
// }

using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<CourseModule> CourseModules { get; set; }

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
        }
    }
}