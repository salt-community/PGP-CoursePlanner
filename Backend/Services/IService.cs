using Backend.Models;
using System.Linq;


namespace Backend.Services;

public interface IService
{
    Task<Module> CreateModuleAsync(Module module);
    Task<List<Module>> GetAllModulesAsync();
    Task<Module> GetSpecificModule(int id);
    Task<Module> UpdateModule(Module module);
    Task<bool> DeleteModule(int id);
}