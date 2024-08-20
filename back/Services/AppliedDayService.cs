using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AppliedDayService : IService<AppliedDay>
    {
        private readonly DataContext _context;

        public AppliedDayService(DataContext context)
        {
            _context = context;
        }

        public async Task<AppliedDay> GetOneAsync(int id)
        {
            var appliedDay = await _context.AppliedDays
                    .Include(day => day.Events)
                    .FirstOrDefaultAsync(day => day.Id == id);
            return appliedDay ?? null!;
        }

        public async Task<AppliedDay> CreateAsync(AppliedDay appliedDay)
        {
            _context.Entry(appliedDay).State = EntityState.Added;
            await _context.AppliedDays.AddAsync(appliedDay);
            await _context.SaveChangesAsync();

            return appliedDay;
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<AppliedDay>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<AppliedDay> UpdateAsync(int id, AppliedDay T)
        {
            throw new NotImplementedException();
        }
    }
}