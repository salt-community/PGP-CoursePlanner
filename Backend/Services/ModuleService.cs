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

            foreach (var oldDay in moduleToUpdate.Days)
            {
                var newDay = module.Days.FirstOrDefault(d => d.Id == oldDay.Id);
                if (newDay != null)
                {
                    var eventsToDelete = oldDay.Events
                        .Where(eventItem => !newDay.Events.Any(e => e.Id == eventItem.Id))
                        .ToList();
                    foreach (var eventItem in eventsToDelete)
                    {
                        _context.Events.Remove(eventItem);
                    }
                }
                else
                {
                    _context.Days.Remove(oldDay);
                }
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
        module.Track = newModule.Track;

        return module;
    }
}
