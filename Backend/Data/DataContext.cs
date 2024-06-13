using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses {get; set;}
        public DbSet<Module> Modules {get; set;}
        public DbSet<Day> Days {get; set;}
        public DbSet<Event> Events {get; set;}
    }
}