using Backend.Models;
using System.Linq;
using static Backend.Repositories.SpecificRepo;

namespace Backend.Services;

public class ModuleService : IService
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
    public async Task<List<Module>> GetAllModulesAsync()
    {
        Console.WriteLine("!!!!!!!!!!!!Service");
        return await _repo.GetAllAsync();
    }
    public async Task<Module> GetSpecificModule(int id)
    {
        return await _repo.GetSpecificAsync(module => module.Id == id); 
    }
    public async Task<Module> UpdateModule(Module module)
    {
        return await _repo.UpdateAsync(module);
    }
    public async Task<bool> DeleteModule(int id)
    {
        return await _repo.DeleteAsync(module => module.Id == id);
    }
}