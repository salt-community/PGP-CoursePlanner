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

        // public async Task<AppliedModule> CreateAsync(AppliedModule appliedModule)
        // {
        //     var module = await _context.Modules
        //                 .Include(module => module.Days)
        //                 .ThenInclude(day => day.Events)
        //                 .FirstOrDefaultAsync(module => module.Id == appliedModule.Id);

        //     var newAppliedModule = new AppliedModule()
        //     {
        //         Name = module!.Name,
        //         NumberOfDays = module.NumberOfDays,
        //         Track = module.Track
        //     };

        //     var listOfAppliedDays = new List<AppliedDay>();
        //     foreach (var day in module!.Days)
        //     {
        //         var appliedDay = new AppliedDay()
        //         {
        //             DayNumber = day.DayNumber,
        //             Description = day.Description
        //         };
        //         listOfAppliedDays.Add(appliedDay);

        //         var listOfAppliedEvents = new List<AppliedEvent>();
        //         foreach (var eventItem in day.Events)
        //         {
        //             var appliedEvent = new AppliedEvent()
        //             {
        //                 Name = eventItem.Name,
        //                 StartTime = eventItem.StartTime,
        //                 EndTime = eventItem.EndTime,
        //                 Description = eventItem.Description
        //             };
        //             _context.AppliedEvents.Add(appliedEvent);
        //             listOfAppliedEvents.Add(appliedEvent);
        //         }
        //         appliedDay.Events = listOfAppliedEvents;
        //         _context.AppliedDays.Add(appliedDay);
        //     }
        //     newAppliedModule.Days = listOfAppliedDays;
        //     _context.AppliedModules.Add(newAppliedModule);
        //     await _context.SaveChangesAsync();
        //     return newAppliedModule;
        // }

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

                // foreach (var oldModule in appliedCourseToUpdate.Modules!)
                // {
                //     var newModule = appliedCourse.Modules!.FirstOrDefault(d => d.Id == oldModule.Id);
                //     if (newModule != null)
                //     {
                //         foreach (var oldDay in oldModule.Days)
                //         {
                //             var newDay = newModule!.Days.FirstOrDefault(d => d.Id == oldDay.Id);
                //             if (newDay != null)
                //             {
                //                 var eventsToDelete = oldDay.Events
                //                     .Where(eventItem => !newDay.Events.Any(e => e.Id == eventItem.Id))
                //                     .ToList();
                //                 foreach (var eventItem in eventsToDelete)
                //                 {
                //                     _context.AppliedEvents.Remove(eventItem);
                //                 }
                //             }
                //             else
                //             {
                //                 _context.AppliedDays.Remove(oldDay);
                //             }
                //         }
                //     }
                //     else
                //     {
                //         _context.AppliedModules.Remove(oldModule);
                //     }
                // }
                // await _context.SaveChangesAsync();

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