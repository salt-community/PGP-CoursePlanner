using System.Globalization;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;
public static class CalendarDateLogic
{

    public static CalendarDate?[] GetCalendarDateBatch(DateTime start, DateTime end, DataContext context)
    {
        var convertedDateStart = DateTime.SpecifyKind(start, DateTimeKind.Utc);
        var convertedDateEnd = DateTime.SpecifyKind(end, DateTimeKind.Utc);

        CalendarDate?[] dates = new CalendarDate[Convert.ToInt32(Math.Ceiling((convertedDateEnd - convertedDateStart).TotalDays)) + 1];

        var dbDates = context.CalendarDates
                        .Include(convertedDate => convertedDate.DateContent)
                        .ThenInclude(content => content.Events)
                        .Where(calendarDate => calendarDate.Date.Date >= convertedDateStart.Date && calendarDate.Date.Date <= convertedDateEnd.Date).ToList();


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
        return dates;
    }

    private static DateTime GetMondayDate(int year, int weekNumber)
    {
        var cultureInfo = CultureInfo.InvariantCulture;
        Calendar calendar = cultureInfo.Calendar;

        CalendarWeekRule weekRule = CalendarWeekRule.FirstFourDayWeek;
        DayOfWeek firstDayOfWeek = DayOfWeek.Monday;

        DateTime jan4 = new DateTime(year, 1, 4);

        int firstWeek = calendar.GetWeekOfYear(jan4, weekRule, firstDayOfWeek);
        DateTime firstMonday = jan4.AddDays(-(int)(jan4.DayOfWeek - DayOfWeek.Monday));

        DateTime mondayOfWeek = firstMonday.AddDays((weekNumber - firstWeek) * 7);

        return mondayOfWeek;
    }

    public static CalendarDate?[] GetCalendarDate2Weeks(int weekNumber, DataContext context)
    {
        var year = DateTime.Now.Year;
        var mondayDate = GetMondayDate(year, weekNumber);
        Console.WriteLine(mondayDate);

        return GetCalendarDateBatch(mondayDate, mondayDate.AddDays(13), context);
    }


}


