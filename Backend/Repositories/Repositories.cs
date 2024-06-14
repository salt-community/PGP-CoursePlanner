using System.Diagnostics;
using System.Linq.Expressions;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositores
{
    public class Repositores
    {
        public class ModuleRepo : Repo<Module>
        {
            private readonly DataContext _context;

            public ModuleRepo(DataContext context) : base(context)
            {
                _context = context;
            }

            public override async Task<List<Module>> GetAllAsync()
            {
                return await _context.Modules
                                            .Include(module => module.Days)
                                            .ThenInclude(day => day.Events)
                                            .ToListAsync();
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
        }
    }
}