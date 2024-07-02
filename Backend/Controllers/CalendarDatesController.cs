using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalendarDatesController : ControllerBase
    {
        private readonly DataContext _context;

        public CalendarDatesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{date}")]

        public async Task<ActionResult<CalendarDate>> GetCalendarDate(DateTime date)
        {
            var response = await _context.CalendarDates
                            .Include(date => date.DateContent)
                            .ThenInclude(content => content.Events)
                            .FirstOrDefaultAsync(calendarDate => calendarDate.Date.Date == date.Date);

            if (response != null)
            {
                return Ok(response);
            }
            return NotFound("Date does not exist");
        }
    }
}