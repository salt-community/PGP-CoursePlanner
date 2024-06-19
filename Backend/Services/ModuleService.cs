using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;
using static Backend.Repositories.SpecificRepo;

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
    public async Task<Module> UpdateAsync(Module module)
    {
        try
        {
            var moduleToUpdate = await _context.Modules
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(m => m.Id == module.Id);

            if (moduleToUpdate == null)
            {
                return null!;
            }

            var allDaysInDB = await _context.Days
                .Include(day => day.Events)
                .AsNoTracking()
                .ToListAsync();

            var daysToDelete = moduleToUpdate.Days
                .Where(day => !module.Days
                .Any(d => d.Id == day.Id))
                .ToList();

            foreach (var day in daysToDelete)
            {
                _context.Days.Remove(day);
            }

            _context.Set<Module>().Update(module);
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
            var response = await _context.Modules
                .Include(module => module.Days)
                .ThenInclude(day => day.Events)
                .FirstOrDefaultAsync(module => module.Id == id);

            if (response != null)
            {
                _context.Remove(response);
                await _context.SaveChangesAsync();
            }

            return true;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }
}
