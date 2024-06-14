using Backend.Models;
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
}