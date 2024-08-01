using System.Diagnostics;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AppliedModuleService : IService<AppliedModule>
    {
        private readonly DataContext _context;

        public AppliedModuleService(DataContext context)
        {
            _context = context;
        }

        public async Task<AppliedModule> GetOneAsync(int id)
        {
            var appliedModule = await _context.AppliedModules
                    .Include(module => module!.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(module => module.Id == id);
            return appliedModule ?? null!;
        }

        public async Task<AppliedModule> CreateAsync(AppliedModule appliedModule)
        {
            _context.ChangeTracker.Clear(); // Clear change tracker
            _context.Entry(appliedModule).State = EntityState.Added; // Mark as Added
            await _context.AppliedModules.AddAsync(appliedModule);
            await _context.SaveChangesAsync();

            return appliedModule;
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<AppliedModule>> GetAllAsync()
        {
            try
            {
                var appliedModules = await _context.AppliedModules
                    .Include(module => module!.Days)
                    .ThenInclude(day => day.Events)
                    .ToListAsync();

                return appliedModules;
            }
            catch (Exception ex) { Debug.WriteLine(ex.Message); }
            return null!;
        }

        public async Task<AppliedModule> UpdateAsync(int id, AppliedModule appliedModule)
        {
            try
            {
                var appliedModuleToUpdate = await _context.AppliedModules
                        .Include(module => module!.Days)
                        .ThenInclude(day => day.Events)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(ac => ac.Id == id);

                if (appliedModuleToUpdate == null)
                {
                    return null!;
                }

                appliedModuleToUpdate.Name = appliedModule.Name;
                appliedModuleToUpdate.NumberOfDays = appliedModule.NumberOfDays;
                appliedModuleToUpdate.Days = appliedModule.Days;

                _context.ChangeTracker.Clear();
                _context.AppliedModules.Update(appliedModuleToUpdate);
                await _context.SaveChangesAsync();
                return appliedModuleToUpdate;
            }
            catch (Exception ex) { Debug.WriteLine(ex.Message); }
            return null!;
        }
    }
}