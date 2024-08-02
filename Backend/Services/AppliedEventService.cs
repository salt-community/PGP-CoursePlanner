using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AppliedEventService : IService<AppliedEvent>
    {
        private readonly DataContext _context;

        public AppliedEventService(DataContext context)
        {
            _context = context;
        }

        public async Task<AppliedEvent> GetOneAsync(int id)
        {
            var appliedEvent = await _context.AppliedEvents
                    .FirstOrDefaultAsync(eventItem => eventItem.Id == id);
            return appliedEvent ?? null!;
        }

        public async Task<AppliedEvent> CreateAsync(AppliedEvent appliedEvent)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(appliedEvent).State = EntityState.Added; 
            await _context.AppliedEvents.AddAsync(appliedEvent);
            await _context.SaveChangesAsync();

            return appliedEvent;
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<AppliedEvent>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<AppliedEvent> UpdateAsync(int id, AppliedEvent T)
        {
            throw new NotImplementedException();
        }
    }
}