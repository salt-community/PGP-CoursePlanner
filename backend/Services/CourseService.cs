using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CourseService(DataContext context) : IService<Course>
{
    private readonly DataContext _context = context;

    public async Task<List<Course>> GetAllAsync()
    {
        var courses = await _context.Courses
            .Include(course => course.Modules)
                .ThenInclude(module => module.Days)
                .ThenInclude(day => day.Events)
            .Include(c => c.Track)
            .Include(c => c.MiscellaneousEvents)
                .ToListAsync();

        foreach (var course in courses)
        {
            foreach (var module in course.Modules)
            {
                module.Days = module.Days.OrderBy(d => d.DayNumber).ToList();
                foreach (var day in module.Days)
                {
                    day.Events = day.Events.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).ToList();
                }
            }
        }
        return courses;
    }

    public async Task<Course> GetOneAsync(int id)
    {
        var course = await _context.Courses
            .Include(course => course.Modules)
                .ThenInclude(module => module.Days)
                .ThenInclude(day => day.Events)
            .Include(c => c.Track)
            .Include(c => c.MiscellaneousEvents)
            .FirstOrDefaultAsync(course => course.Id == id)
            ?? throw new NotFoundByIdException("Course", id);

        foreach (var module in course.Modules)
        {
            module.Days = module.Days.OrderBy(d => d.DayNumber).ToList();
            foreach (var day in module.Days)
            {
                day.Events = day.Events.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).ToList();
            }
        }
        return course;
    }

    private async Task<Course> CreateAppliedCourseAsync(Course appliedCourse)
    {
        Console.WriteLine("Entering CreateAppliedCourseAsync...");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var trackId = appliedCourse.Track.Id;
            var existingTrack = await _context.Tracks.FirstOrDefaultAsync(t => t.Id == trackId);
            if (existingTrack == null)
            {
                throw new Exception($"Track with ID {trackId} not found.");
            }
            appliedCourse.Track = existingTrack;

            _context.Courses.Add(appliedCourse);
            await _context.SaveChangesAsync();

            AddDaysToCalendar(appliedCourse);

            foreach (var module in appliedCourse.Modules)
            {
                foreach (var day in module.Days)
                {
                    foreach (var @event in day.Events)
                    {
                        var calendarDate = await _context.CalendarDates
                            .FirstOrDefaultAsync(cd => cd.Date.Date == day.Date.Date);
                        if (calendarDate != null)
                        {
                            @event.DateContents = calendarDate.DateContent;
                            @event.IsApplied = true;
                        }
                        else
                        {
                            Console.WriteLine($"Warning: No CalendarDate found for {day.Date.Date}");
                        }
                    }
                    day.IsApplied = true;
                }
                module.IsApplied = true;
            }

            Console.WriteLine("Setting module IDs...");
            appliedCourse.ModuleIds = appliedCourse.Modules.Select(m => m.Id).ToList();

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            Console.WriteLine($"Successfully created AppliedCourse with ID {appliedCourse.Id}.");

            return await _context.Courses
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Days)
                    .ThenInclude(d => d.Events)
                .Include(c => c.Track)
                .FirstAsync(c => c.Id == appliedCourse.Id);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"Error in CreateAppliedCourseAsync: {ex.Message}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");
            throw;
        }
    }

    private void AddDaysToCalendar(Course appliedCourse)
    {
        foreach (var module in appliedCourse.Modules)
        {
            foreach (var day in module!.Days)
            {
                var localDate = day.Date.AddHours(1); // only UTC is supported so we need to do this

                var dateContent = new DateContent()
                {
                    CourseName = appliedCourse.Name!,
                    Track = appliedCourse.Track,
                    ModuleName = module.Name,
                    DayOfModule = day.DayNumber,
                    TotalDaysInModule = module.NumberOfDays,
                    Events = day.Events,
                    Color = appliedCourse.Color,
                    appliedCourseId = appliedCourse.Id,
                    ModuleId = module.Id,
                };

                var calendarDate = _context.CalendarDates.FirstOrDefault(cd => cd.Date == localDate);

                if (calendarDate != null)
                {
                    calendarDate.DateContent.Add(dateContent);
                }
                else
                {
                    Console.WriteLine(localDate);
                    calendarDate = new CalendarDate
                    {
                        Date = localDate
                    };
                    _context.CalendarDates.Add(calendarDate);
                    _context.SaveChanges();
                    calendarDate.DateContent.Add(dateContent);
                }
            }
        }
        _context.SaveChanges();

        foreach (var @event in appliedCourse.MiscellaneousEvents)
        {

            var eventDate = DateTime.Parse(@event.StartTime).ToUniversalTime().AddHours(1);

            var dateContent = new DateContent()
            {
                ModuleName = @event.Name,
                CourseName = appliedCourse.Name!,
                Track = appliedCourse.Track,
                DayOfModule = 1,
                TotalDaysInModule = 1,
                Events = [@event],
                Color = appliedCourse.Color,
                appliedCourseId = appliedCourse.Id,
                ModuleId = 0,
            };

            var calendarDate = _context.CalendarDates
                .FirstOrDefault(cd => cd.Date.Date == eventDate.Date);

            if (calendarDate != null)
            {
                calendarDate.DateContent.Add(dateContent);
            }
            else
            {
                calendarDate = new CalendarDate
                {
                    Date = eventDate.Date
                };
                _context.CalendarDates.Add(calendarDate);
                _context.SaveChanges();
                calendarDate.DateContent.Add(dateContent);
            }
        }

        _context.SaveChanges();
    }

    public async Task<Course> CreateAsync(Course course)
    {
        if (course.IsApplied == true)
        {
            return await CreateAppliedCourseAsync(course);
        }

        Console.WriteLine("Im in the createAsync");
        var track = _context.Tracks.First(t => t.Id == course.Track.Id);

        course.Track = track;

        var modulesInDb = await _context.Modules
                .Where(m => course.ModuleIds.Contains(m.Id))
                .ToListAsync();

        course.Modules = [.. modulesInDb];
        await _context.Courses.AddAsync(course);
        await _context.SaveChangesAsync();
        return course;
    }

    private void RemoveAllDaysFromCalendar(int id)
    {
        var courseDaysContet = _context.DateContent.Where(dc => dc.appliedCourseId == id);
        _context.DateContent.RemoveRange(courseDaysContet);
    }
    private async Task<Course> UpdateAppliedAsync(int id, Course course)
    {

        var appliedCourse = await _context.Courses.Include(c => c.Modules)
                                            .Include(c => c.Track)
                                            .Include(c => c.MiscellaneousEvents)
                                            .FirstOrDefaultAsync(c => c.Id == course.Id)
                                            ?? throw new NotFoundByIdException("course", course.Id);
        await DeleteAppliedAsync(appliedCourse);

        var res = await CreateAppliedCourseAsync(course);

        return res;
    }

    private DateTime CalculateEndDate(Course course)
    {
        var numberOfDays = _context.CalendarDates
            .Include(cd => cd.DateContent)
            .Where(cd => cd.DateContent.Any(dc => dc.appliedCourseId == course.Id)).Count();

        if (numberOfDays == 0) return course.StartDate;

        return course.StartDate.AddDays(numberOfDays - 1).Date;
    }

    private async Task<DateTime> AddModuleToCourse(Course course, int moduleId, DateTime moduleDate, int order)
    {
        var courseToAddTo = await _context.Courses
                        .Include(course => course.Modules)
                        .FirstOrDefaultAsync(ac => ac.Id == course.Id)
                        ?? throw new NotFoundByIdException("Course", course.Id);

        var moduleToAddData = await _context.Modules
                        .Include(m => m.Days)
                        .ThenInclude(d => d.Events)
                        .FirstOrDefaultAsync(m => m.Id == moduleId)
                        ?? throw new NotFoundByIdException("Module", moduleId);

        Module moduleToAdd = moduleToAddData.ShallowClone();
        moduleToAdd.SetIsApplied();
        moduleToAdd.Order = order;

        foreach (var day in moduleToAddData.Days.OrderBy(d => d.DayNumber))
        {
            var dayToAdd = day.ShallowClone();
            foreach (var @event in day.Events)
            {
                var eventToAdd = @event.ShallowClone();
                if (eventToAdd.StartTime.Length == 4)
                    eventToAdd.StartTime = "0" + eventToAdd.StartTime;
                if (eventToAdd.EndTime.Length == 4)
                    eventToAdd.EndTime = "0" + eventToAdd.EndTime;
                _context.Events.Add(eventToAdd);
                dayToAdd.Events.Add(eventToAdd);
            }
            _context.Days.Add(dayToAdd);
            moduleToAdd.Days.Add(dayToAdd);

            var dateContent = new DateContent()
            {
                CourseName = courseToAddTo.Name!,
                ModuleName = moduleToAdd.Name,
                DayOfModule = dayToAdd.DayNumber,
                TotalDaysInModule = moduleToAdd.NumberOfDays,
                Events = dayToAdd.Events,
                Color = courseToAddTo.Color,
                appliedCourseId = courseToAddTo.Id,
            };
            await _context.DateContent.AddAsync(dateContent);

            var date = await _context.CalendarDates.
                        Include(cm => cm.DateContent)
                        .ThenInclude(dc => dc.Events)
                        .FirstOrDefaultAsync(date => date.Date.Date == moduleDate.Date);

            if (date == null)
            {
                date = new CalendarDate()
                {
                    Date = moduleDate.Date,
                };
                date.DateContent.Add(dateContent);

                await _context.CalendarDates.AddAsync(date);
            }
            else
            {
                date.DateContent.Add(dateContent);
                _context.CalendarDates.Update(date);

            }
            moduleDate = moduleDate.AddDays(1);

            if (moduleDate.DayOfWeek == DayOfWeek.Saturday && !(day.DayNumber == moduleToAdd.NumberOfDays && moduleId == courseToAddTo.ModuleIds.Last()))
            {
                AddWeekendDates(courseToAddTo, moduleToAdd, moduleDate);
                moduleDate = moduleDate.AddDays(2);
            }
            _context.SaveChanges();
        }

        courseToAddTo.Modules.Add(moduleToAdd);
        _context.SaveChanges();

        return moduleDate;
    }

    private bool AddWeekendDates(Course course, Module module, DateTime moduleDate)
    {
        var dateContentSaturday = new DateContent()
        {
            CourseName = course.Name!,
            ModuleName = module.Name + " (weekend)",
            DayOfModule = 0,
            TotalDaysInModule = module.NumberOfDays,
            Events = [],
            Color = course.Color,
            appliedCourseId = course.Id
        };
        _context.DateContent.Add(dateContentSaturday);
        var dateContentSunday = new DateContent()
        {
            CourseName = course.Name!,
            ModuleName = module.Name + " (weekend)",
            DayOfModule = 0,
            TotalDaysInModule = module.NumberOfDays,
            Events = [],
            Color = course.Color,
            appliedCourseId = course.Id
        };
        _context.DateContent.Add(dateContentSunday);
        _context.SaveChanges();

        var dateSaturday = _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefault(date => date.Date.Date == moduleDate.Date);
        if (dateSaturday == null)
        {
            dateSaturday = new CalendarDate()
            {
                Date = moduleDate.Date,
                DateContent = new List<DateContent> { dateContentSaturday }
            };
            _context.CalendarDates.Add(dateSaturday);
            _context.SaveChanges();
        }
        else
        {
            dateSaturday.DateContent.Add(dateContentSaturday);
            _context.CalendarDates.Update(dateSaturday);
            _context.SaveChanges();
        }

        var dateSunday = _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefault(date => date.Date.Date == moduleDate.AddDays(1).Date);
        if (dateSunday == null)
        {
            dateSunday = new CalendarDate()
            {
                Date = moduleDate.AddDays(1).Date,
                DateContent = new List<DateContent> { dateContentSunday }
            };
            _context.CalendarDates.Add(dateSunday);
            _context.SaveChanges();
        }
        else
        {
            dateSunday.DateContent.Add(dateContentSunday);
            _context.CalendarDates.Update(dateSunday);
            _context.SaveChanges();
        }
        return true;
    }

    private bool ClearModuleOfDays(Module module, int courseId)
    {
        foreach (var day in module.Days)
        {
            _context.Events.RemoveRange(day.Events);
        }

        _context.Days.RemoveRange(module.Days);

        //this part removes dateContent
        var calendarDates = _context.CalendarDates
            .Include(cd => cd.DateContent)
            .Where(cd => cd.DateContent.Any(dc => dc.appliedCourseId == courseId));

        foreach (var calendarDate in calendarDates)
        {
            calendarDate.DateContent.RemoveAll(dc => dc.appliedCourseId == courseId);

            if (calendarDate.DateContent.Count == 0)
            {
                _context.CalendarDates.Remove(calendarDate);
            }
            else
            {
                _context.CalendarDates.Update(calendarDate);
            }
        }

        _context.SaveChanges();
        return true;
    }

    private bool ClearCourseOfMiscEvents(Course course)
    {
        _context.RemoveRange(course.MiscellaneousEvents);
        //this part removes dateContent
        var calendarDates = _context.CalendarDates
            .Include(cd => cd.DateContent)
            .Where(cd => cd.DateContent.Any(dc => dc.appliedCourseId == course.Id));

        foreach (var calendarDate in calendarDates)
        {
            calendarDate.DateContent.RemoveAll(dc => dc.appliedCourseId == course.Id);

            if (calendarDate.DateContent.Count == 0)
            {
                _context.CalendarDates.Remove(calendarDate);
            }
            else
            {
                _context.CalendarDates.Update(calendarDate);
            }
        }

        _context.SaveChanges();
        return true;
    }
    
    public async Task UpdateAsync(int id, Course course)
    {
        if (course.IsApplied)
        {
            await UpdateAppliedAsync(id, course);
            return;
        }

        var courseToUpdate = await _context.Courses
                .Include(course => course.Modules)
                .ThenInclude(module => module!.Days)
                .ThenInclude(day => day.Events)
                .FirstOrDefaultAsync(course => course.Id == id)
                ?? throw new NotFoundByIdException("Course", id);


        var moduleIds = course.ModuleIds;
        var modulesInDb = await _context.Modules
                .Where(m => moduleIds.Contains(m.Id))
                .ToListAsync();

        courseToUpdate.Name = course.Name;
        courseToUpdate.NumberOfWeeks = course.NumberOfWeeks;
        courseToUpdate.ModuleIds = course.ModuleIds;

        courseToUpdate.Modules.Clear();

        _context.Courses.Update(courseToUpdate);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var course = _context.Courses
               .Include(course => course.Modules)
               .ThenInclude(module => module.Days)
               .ThenInclude(day => day.Events)
               .AsNoTracking()
               .FirstOrDefault(c => c.Id == id);

        if (course == null) return;

        if (course.IsApplied)
        {
            await DeleteAppliedAsync(course);
            return;
        }
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAppliedAsync(Course course)
    {
        ClearCourseOfMiscEvents(course);

        await _context.SaveChangesAsync();
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
    }
}