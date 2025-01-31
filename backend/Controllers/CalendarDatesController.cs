using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class CalendarDatesController(IServiceCalendarDates<CalendarDate> service) : ControllerBase
{
    private readonly IServiceCalendarDates<CalendarDate> _service = service;

    [HttpGet("{date}")]
    public async Task<CalendarDate> GetCalendarDate(DateTime date) => await _service.GetCalendarDate(date);

    [HttpGet("batch")]
    public async Task<ActionResult<List<CalendarDate>>> GetCalendarDateBatch(DateTime start, DateTime end)
    {
        if (end < start)
        {
            return BadRequest("Start date has to be before end date");
        }

        return await _service.GetCalendarDateBatch(start, end);
    }

    [HttpGet("Weeks/{weekNumber}")]
    public async Task<ActionResult<List<CalendarDate>>> GetCalendarDate2Weeks(int weekNumber)
    {
        if (weekNumber < 1 || weekNumber > 53)
        {
            return BadRequest("Week number has to be between 1 and 53");
        }

        return await _service.GetCalendarDate2Weeks(weekNumber);
    }
}
