using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize]
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
            var convertedDate = DateTime.SpecifyKind(date, DateTimeKind.Utc);
            var response = await _context.CalendarDates
                            .Include(convertedDate => convertedDate.DateContent)
                            .ThenInclude(content => content.Events)
                            .FirstOrDefaultAsync(calendarDate => calendarDate.Date.Date == convertedDate.Date);

            if (response != null)
            {
                return Ok(response);
            }
            return NotFound("Date does not exist");
        }
    }
}