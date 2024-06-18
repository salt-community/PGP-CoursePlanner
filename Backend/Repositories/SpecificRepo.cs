using System.Diagnostics;
using System.Linq.Expressions;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class SpecificRepo
    {
        public class ModuleRepo : AbstractRepo<Module>
        {
            private readonly DataContext _context;

            public ModuleRepo(DataContext context) : base(context)
            {
                _context = context;
            }

            public override async Task<List<Module>> GetAllAsync()
            {
                var result = await _context.Modules
                                            .Include(module => module.Days)
                                            .ThenInclude(day => day.Events)
                                            .ToListAsync();
                return result;
            }

            public override async Task<Module> GetSpecificAsync(Expression<Func<Module, bool>> predicate)
            {
                return await _context.Modules
                    .Include(module => module.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(predicate) ?? null!;
            }

            public override async Task<bool> DeleteAsync(Expression<Func<Module, bool>> predicate)

            {
                try
                {
                    var response = await _context.Modules
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .FirstOrDefaultAsync(predicate);

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

            public override async Task<Module> UpdateAsync(Module module)
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
        }
    }
}