
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class StartDateService
    {
        private readonly DataContext _context;

        public StartDateService(DataContext context)
        {
            _context = context;
        }

        public async Task<StartDate> CreateStartDateAsync(DateTime StartDate)
        {
            
        }
    }
}