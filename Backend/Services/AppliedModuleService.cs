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
            var module = await _context.Modules
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .FirstOrDefaultAsync(module => module.Id == appliedModule.Id);

            var newAppliedModule = new AppliedModule()
            {
                Name = module!.Name,
                NumberOfDays = module.NumberOfDays,
                Track = module.Track
            };

            var listOfAppliedDays = new List<AppliedDay>();
            foreach (var day in module!.Days)
            {
                var appliedDay = new AppliedDay()
                {
                    DayNumber = day.DayNumber,
                    Description = day.Description
                };
                listOfAppliedDays.Add(appliedDay);

                var listOfAppliedEvents = new List<AppliedEvent>();
                foreach (var eventItem in day.Events)
                {
                    var appliedEvent = new AppliedEvent()
                    {
                        Name = eventItem.Name,
                        StartTime = eventItem.StartTime,
                        EndTime = eventItem.EndTime,
                        Description = eventItem.Description
                    };
                    _context.AppliedEvents.Add(appliedEvent);
                    listOfAppliedEvents.Add(appliedEvent);
                }
                appliedDay.Events = listOfAppliedEvents;
                _context.AppliedDays.Add(appliedDay);
            }
            newAppliedModule.Days = listOfAppliedDays;
            _context.AppliedModules.Add(newAppliedModule);
            await _context.SaveChangesAsync();
            return newAppliedModule;

        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<AppliedModule>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<AppliedModule> UpdateAsync(int id, AppliedModule T)
        {
            throw new NotImplementedException();
        }
    }
}