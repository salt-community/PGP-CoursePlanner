using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CourseModuleService : IService<CourseModule>
    {

        private readonly DataContext _context;

        public CourseModuleService(DataContext context)
        {
            _context = context;
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<CourseModule> GetOneAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<CourseModule> UpdateAsync(int id, CourseModule T)
        {
            throw new NotImplementedException();
        }

        public Task<CourseModule> CreateAsync(CourseModule courseModule)
        {
            throw new NotImplementedException();
        }


        public Task<List<CourseModule>> GetAllAsync()
        {
            return _context.CourseModules.ToListAsync();
        }


    }
}