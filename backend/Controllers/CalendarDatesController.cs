using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;
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

    [HttpGet("batch")]
    public ActionResult<List<CalendarDate>> GetCalendarDateBatch(DateTime start, DateTime end)
    {
        //todo: make async
        //todo: add blank dates to list if nothing is found in database? 
        var convertedDateStart = DateTime.SpecifyKind(start, DateTimeKind.Utc);
        var convertedDateEnd = DateTime.SpecifyKind(end, DateTimeKind.Utc);

        var response = _context.CalendarDates
                        .Include(convertedDate => convertedDate.DateContent)
                        .ThenInclude(content => content.Events)
                        .Where(calendarDate =>  calendarDate.Date.Date >= convertedDateStart.Date && calendarDate.Date.Date <= convertedDateEnd.Date).ToList();

        if (response != null)
        {
            return Ok(response);
        }
        return NotFound("Date does not exist");
    }

}
