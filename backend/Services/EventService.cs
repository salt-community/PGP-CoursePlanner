using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class EventService : IService<Event>
    {
        private readonly DataContext _context;

        public EventService(DataContext context)
        {
            _context = context;
        }

        public async Task<Event> CreateAsync(Event eventItem)
        {

            _context.ChangeTracker.Clear();
            _context.Entry(eventItem).State = EntityState.Added;
            await _context.Events.AddAsync(eventItem);
            await _context.SaveChangesAsync();

            return eventItem;
        }

        public async Task<Event> GetOneAsync(int id)
        {
            return await _context.Events
                    .FirstOrDefaultAsync(eventItem => eventItem.Id == id)
                    ?? throw new NotFoundByIdException("Event", id);
        }

        public Task<List<Event>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(int id, Event T)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}