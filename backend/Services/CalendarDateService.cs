using System.Globalization;
using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;
public class CalendarDateService(DataContext context) : IServiceCalendarDates<CalendarDate>
{
    private readonly DataContext _context = context;

    public async Task<CalendarDate> GetCalendarDate(DateTime date)
    {
        var convertedDate = DateTime.SpecifyKind(date, DateTimeKind.Utc);

        return await _context.CalendarDates
                        .Include(convertedDate => convertedDate.DateContent)
                        .ThenInclude(content => content.Events)
                        .FirstOrDefaultAsync(calendarDate => calendarDate.Date.Date == convertedDate.Date)
                        ?? throw new NotFoundException<CalendarDate>("Content for Calendar Date Not Found");
    }

    public async Task<List<CalendarDate>> GetCalendarDateBatch(DateTime start, DateTime end)
    {
        var convertedDateStart = DateTime.SpecifyKind(start, DateTimeKind.Utc);
        var convertedDateEnd = DateTime.SpecifyKind(end, DateTimeKind.Utc);

        var dates = new CalendarDate[Convert.ToInt32(Math.Ceiling((convertedDateEnd - convertedDateStart).TotalDays)) + 1];

        var dbDates = await _context.CalendarDates
                        .Include(convertedDate => convertedDate.DateContent)
                        .ThenInclude(content => content.Track)
                        .Include(convertedDate => convertedDate.DateContent)
                        .ThenInclude(content => content.Events)
                        .Where(calendarDate => calendarDate.Date.Date >= convertedDateStart.Date && calendarDate.Date.Date <= convertedDateEnd.Date).ToListAsync();

        for (int i = 0; i < dates.Length; i++)
        {
            var day = dbDates.FirstOrDefault(d => d.Date.Date == convertedDateStart.AddDays(i));

            if (day != null)
            {
                dates[i] = day;
            }
            else
            {
                dates[i] = new CalendarDate() { Date = convertedDateStart.AddDays(i) };
            }
        }
        return [.. dates];
    }

    public async Task<List<CalendarDate>> GetCalendarDate2Weeks(int weekNumber)
    {
        var year = DateTime.Now.Year;
        var mondayDate = GetMondayDate(year, weekNumber);

        return await GetCalendarDateBatch(mondayDate, mondayDate.AddDays(13));
    }

    private static DateTime GetMondayDate(int year, int weekNumber)
    {
        var cultureInfo = CultureInfo.InvariantCulture;
        Calendar calendar = cultureInfo.Calendar;

        CalendarWeekRule weekRule = CalendarWeekRule.FirstFourDayWeek;
        DayOfWeek firstDayOfWeek = DayOfWeek.Monday;

        DateTime jan4 = new(year, 1, 4);

        int firstWeek = calendar.GetWeekOfYear(jan4, weekRule, firstDayOfWeek);
        DateTime firstMonday = jan4.AddDays(-(int)(jan4.DayOfWeek - DayOfWeek.Monday));

        DateTime mondayOfWeek = firstMonday.AddDays((weekNumber - firstWeek) * 7);

        return mondayOfWeek;
    }
}


