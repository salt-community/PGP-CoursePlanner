using Backend.Models;
using System.Linq;
using static Backend.Repositories.Repositories;

namespace Backend.Services;

public interface IService
{
    Task<Module> CreateModuleAsync(Module module);
    Task<List<Module>> GetAllModulesAsync();
    Task<Module> GetSpecificModule(int id);
    Task<Module> UpdateModule(Module module);
    Task<bool> DeleteModule(int id);
}