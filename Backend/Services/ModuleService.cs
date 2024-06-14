using Backend.Models;
using System.Linq;
using static Backend.Repositores.Repositores;

namespace Backend.Services;

public class ModuleService
{
    private readonly ModuleRepo _repo;
    
    public ModuleService(ModuleRepo repo)
    {
        _repo = repo;
    }

    public async Task<Module> CreateModuleAsync(Module module)
    {
        return await _repo.CreateAsync(module);   
    }
    public async Task<IEnumerable<Module>> GetAllModulesAsync()
    {
        return await _repo.GetAllAsync();
    }
    public async Task<Module> GetSpecificModule(int id)
    {
        return await _repo.GetSpecificAsync(module => module.Id == id); 
    }
}