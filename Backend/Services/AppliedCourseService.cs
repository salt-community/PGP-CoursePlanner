
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class AppliedCourseService: IService<AppliedCourse>
    {
        private readonly DataContext _context;

        public AppliedCourseService(DataContext context)
        {
            _context = context;
        }

        public Task<AppliedCourse> CreateAsync(AppliedCourse T)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<AppliedCourse>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<AppliedCourse> GetOneAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<AppliedCourse> UpdateAsync(int id, AppliedCourse T)
        {
            throw new NotImplementedException();
        }
    }
}