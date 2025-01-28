using backend.Data;
using backend.Models;
using backend.Services;
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
    public ActionResult<CalendarDate?[]> GetCalendarDateBatch(DateTime start, DateTime end)
    {
        if (end < start)
        {
            return BadRequest("Start date has to be before end date");
        }
        return CalendarDateLogic.GetCalendarDateBatch(start, end, _context);
    }

    [HttpGet("Weeks/{weekNumber}")]
    public ActionResult<CalendarDate?[]> GetCalendarDate2Weeks(int weekNumber)
    {
        if (weekNumber < 1 || weekNumber > 53)
        {
            return BadRequest("Weeknumber has to be between 1 and 53");
        }
        return CalendarDateLogic.GetCalendarDate2Weeks(weekNumber, _context);
    }


}
