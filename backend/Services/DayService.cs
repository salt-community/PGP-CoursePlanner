using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class DayService : IService<Day>
    {
        private readonly DataContext _context;

        public DayService(DataContext context)
        {
            _context = context;
        }

        public async Task<Day> GetOneAsync(int id)
        {
            var appliedDay = await _context.Days
                    .Include(day => day.Events)
                    .FirstOrDefaultAsync(day => day.Id == id);
            return appliedDay ?? null!;
        }

        public async Task<Day> CreateAsync(Day appliedDay)
        {
            appliedDay.IsApplied = true;
            _context.ChangeTracker.Clear();
            _context.Entry(appliedDay).State = EntityState.Added;
            await _context.Days.AddAsync(appliedDay);
            await _context.SaveChangesAsync();

            return appliedDay;
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Day>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Day> UpdateAsync(int id, Day T)
        {
            throw new NotImplementedException();
        }
    }
}