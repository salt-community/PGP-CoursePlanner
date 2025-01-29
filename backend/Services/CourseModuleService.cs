using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CourseModuleService(DataContext context) : IService<CourseModule>
    {
        private readonly DataContext _context = context;

        public Task<List<CourseModule>> GetAllAsync()
        {
            return _context.CourseModules.ToListAsync();
        }

        public Task<CourseModule> GetOneAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<CourseModule> CreateAsync(CourseModule courseModule)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(int id, CourseModule T)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}