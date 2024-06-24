using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Backend.Services;

public class ModuleService : IService<Module>
{
    private readonly DataContext _context;

    public ModuleService(DataContext context)
    {
        _context = context;
    }

    public async Task<List<Module>> GetAllAsync()
    {
        try
        {
            var modules = await _context.Modules
                            .Include(module => module.Days)
                            .ThenInclude(day => day.Events)
                            .ToListAsync();
            return modules;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Module> GetOneAsync(int id)
    {
        try
        {
            return await _context.Modules
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .FirstOrDefaultAsync(module => module.Id == id) ?? null!;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Module> CreateAsync(Module module)
    {
        try
        {
            _context.Modules.Add(module);
            await _context.SaveChangesAsync();
            return module;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Module> UpdateAsync(int id, Module module)
    {
        try
        {
            var moduleToUpdate = await _context.Modules
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(m => m.Id == id);

            if (moduleToUpdate == null)
            {
                return null!;
            }

            var daysToDelete = moduleToUpdate.Days
                .Where(day => !module.Days.Any(d => d.Id == day.Id))
                .ToList();
            foreach (var day in daysToDelete)
            {
                _context.Days.Remove(day);
            }

            moduleToUpdate = updateModule(module, moduleToUpdate);
            _context.Set<Module>().Update(moduleToUpdate);
            await _context.SaveChangesAsync();
            return module;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var module = await _context.Modules
                .Include(module => module.Days)
                .ThenInclude(day => day.Events)
                .FirstAsync(module => module.Id == id);
            _context.Remove(module);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }

    private Module updateModule(Module newModule, Module module)
    {
        module.Name = newModule.Name;
        module.NumberOfDays = newModule.NumberOfDays;
        module.Days = newModule.Days;

        return module;
    }
}
