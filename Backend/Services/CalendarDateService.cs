using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class CalendarDateService : IService<CalendarDate>
    {
        private readonly DataContext _context;

        public CalendarDateService(DataContext context)
        {
            _context = context;
        }

        public Task<CalendarDate> CreateAsync(CalendarDate T)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<CalendarDate>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<CalendarDate> GetOneAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<CalendarDate> UpdateAsync(int id, CalendarDate T)
        {
            throw new NotImplementedException();
        }
    }
}