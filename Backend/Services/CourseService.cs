using Backend.Models;
using System.Linq;
using static Backend.Repositories.SpecificRepo;

namespace Backend.Services;

public class CourseService : IService<Course>
{
    public Task<Course> CreateAsync(Course T)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<List<Course>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Course> GetOneAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Course> UpdateAsync(Course T)
    {
        throw new NotImplementedException();
    }
}