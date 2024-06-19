using Backend.Models;
using System.Linq;
using static Backend.Repositories.SpecificRepo;

namespace Backend.Services;

public class CourseService : IService
{
    public Task<Module> CreateModuleAsync(Module module)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteModule(int id)
    {
        throw new NotImplementedException();
    }

    public Task<List<Module>> GetAllModulesAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Module> GetSpecificModule(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Module> UpdateModule(Module module)
    {
        throw new NotImplementedException();
    }
}