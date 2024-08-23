using System.Diagnostics;
using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
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
            return await _context.AppliedModules
                    .Include(module => module!.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(module => module.Id == id)
                    ?? throw new NotFoundByIdException("Applied module", id);
        }

        public async Task<AppliedModule> CreateAsync(AppliedModule appliedModule)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(appliedModule).State = EntityState.Added;
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

            var appliedModules = await _context.AppliedModules
                .Include(module => module!.Days)
                .ThenInclude(day => day.Events)
                .ToListAsync();

            return appliedModules;

        }

        public async Task<AppliedModule> UpdateAsync(int id, AppliedModule appliedModule)
        {
            var appliedModuleToUpdate = await _context.AppliedModules
                    .Include(module => module!.Days)
                    .ThenInclude(day => day.Events)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(ac => ac.Id == id)
                    ?? throw new NotFoundByIdException("Applied module", id);

            appliedModuleToUpdate.Name = appliedModule.Name;
            appliedModuleToUpdate.NumberOfDays = appliedModule.NumberOfDays;
            appliedModuleToUpdate.Days = appliedModule.Days;

            _context.ChangeTracker.Clear();
            _context.AppliedModules.Update(appliedModuleToUpdate);
            await _context.SaveChangesAsync();
            return appliedModuleToUpdate;
        }
    }
}