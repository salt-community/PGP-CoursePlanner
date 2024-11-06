using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

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
        //todo: make async?
        var convertedDateStart = DateTime.SpecifyKind(start, DateTimeKind.Utc);
        var convertedDateEnd = DateTime.SpecifyKind(end, DateTimeKind.Utc);

        if (convertedDateEnd < convertedDateStart)
        {
            return BadRequest("Start date has to be before end date");
        }

        CalendarDate?[] dates = new CalendarDate[Convert.ToInt32(Math.Ceiling((convertedDateEnd - convertedDateStart).TotalDays)) + 1];

        var dbDates = _context.CalendarDates
                        .Include(convertedDate => convertedDate.DateContent)
                        .ThenInclude(content => content.Events)
                        .Where(calendarDate => calendarDate.Date.Date >= convertedDateStart.Date && calendarDate.Date.Date <= convertedDateEnd.Date).ToList();


        for (int i = 0; i < dates.Length; i++)
        {
            var day = dbDates.FirstOrDefault(d => d.Date == convertedDateStart.AddDays(i));

            if (day != null)
            {
                dates[i] = day;
            }
            else
            {
                dates[i] = null;
            }
        }
        return dates;
    }

    private static DateTime GetMondayDate(int year, int weekNumber)
    {
        // Get the ISO 8601 calendar, which treats the week containing Jan 4 as the first week
        var cultureInfo = CultureInfo.InvariantCulture;
        Calendar calendar = cultureInfo.Calendar;

        // Set the first day of the week to Monday
        CalendarWeekRule weekRule = CalendarWeekRule.FirstFourDayWeek;
        DayOfWeek firstDayOfWeek = DayOfWeek.Monday;

        // Find the first day of the year
        DateTime jan4 = new DateTime(year, 1, 4);

        // Get the first Monday of the first week
        int firstWeek = calendar.GetWeekOfYear(jan4, weekRule, firstDayOfWeek);
        DateTime firstMonday = jan4.AddDays(-(int)(jan4.DayOfWeek - DayOfWeek.Monday));

        // Calculate the Monday of the given week
        DateTime mondayOfWeek = firstMonday.AddDays((weekNumber - firstWeek) * 7);

        return mondayOfWeek;
    }

    [HttpGet("Weeks/{weekNumber}")]
    public ActionResult<CalendarDate?[]> GetCalendarDate2Weeks(int weekNumber)
    {
        var year = DateTime.Now.Year;
        var mondayDate = GetMondayDate(year, weekNumber);
        Console.WriteLine(mondayDate);

        return GetCalendarDateBatch(mondayDate, mondayDate.AddDays(13));
    }


}
