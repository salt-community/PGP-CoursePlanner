using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ModuleService : IService<Module>
{
    private readonly DataContext _context;

    public ModuleService(DataContext context)
    {
        _context = context;
    }

    public async Task<List<Module>> GetAllAsync()
    {
        var modules = await _context.Modules
                        .Include(module => module.Tracks)
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .ToListAsync();

        foreach (var module in modules)
        {
            module.Days = module.Days.OrderBy(d => d.DayNumber).ToList();
            foreach (var day in module.Days)
            {
                foreach (var eventItem in day.Events)
                {
                    if (eventItem.StartTime.Length == 4)
                        eventItem.StartTime = "0" + eventItem.StartTime;
                    if (eventItem.EndTime.Length == 4)
                        eventItem.EndTime = "0" + eventItem.EndTime;
                }
                day.Events = day.Events.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).ToList();
            }
        }
        return modules;
    }

    public async Task<Module> GetOneAsync(int id)
    {
        var module = await _context.Modules
                    .Include(module => module.Tracks)
                    .Include(module => module.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(module => module.Id == id) ?? throw new NotFoundByIdException("Module", id);

        module.Days = module.Days.OrderBy(d => d.DayNumber).ToList();
        foreach (var day in module.Days)
        {
            foreach (var eventItem in day.Events)
            {
                if (eventItem.StartTime.Length == 4)
                    eventItem.StartTime = "0" + eventItem.StartTime;
                if (eventItem.EndTime.Length == 4)
                    eventItem.EndTime = "0" + eventItem.EndTime;
            }
            day.Events = day.Events.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).ToList();
        }
        return module;
    }

    public async Task<Module> CreateAsync(Module module)
{
    if (!module.Days.Any())
    {
        throw new BadRequestException<int>("Cannot create module with zero days.");
    }

    // Ensure existing tracks are attached
    foreach (var track in module.Tracks)
    {
        _context.Tracks.Attach(track);
    }

    // Add and save the new module
    await _context.Modules.AddAsync(module);
    await _context.SaveChangesAsync();

    return module;
}


    public async Task UpdateAsync(int id, Module module)
    {
        if (module.Days.Count == 0)
        {
            throw new BadRequestException<int>("Cannot update module to have zero days");
        }
        var moduleToUpdate = await _context.Modules
                    .Include(module => module.Tracks)
                    .Include(module => module.Days)
                    .ThenInclude(day => day.Events)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.Id == id) ?? throw new NotFoundByIdException("Module", id);

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

        moduleToUpdate = UpdateModule(module, moduleToUpdate);
        _context.Set<Module>().Update(moduleToUpdate);
        await _context.SaveChangesAsync();
    }

    private Module UpdateModule(Module newModule, Module module)
    {
        module.Name = newModule.Name;
        module.NumberOfDays = newModule.NumberOfDays;
        module.Days = newModule.Days;
        module.Tracks = newModule.Tracks;

        return module;
    }

    public async Task DeleteAsync(int id)
    {
        var module = await _context.Modules
            .Include(module => module.Days)
            .ThenInclude(day => day.Events)
            .FirstAsync(module => module.Id == id);
        _context.Remove(module);
        await _context.SaveChangesAsync();
    }
}
