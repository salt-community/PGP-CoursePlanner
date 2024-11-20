using System.Runtime.InteropServices;
using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CourseService : IService<Course>
{
    private readonly DataContext _context;

    public CourseService(DataContext context)
    {
        _context = context;
    }
    public async Task<List<Course>> GetAllAsync()
    {
        var courses = await _context.Courses
            .Include(course => course.Modules)
                .ThenInclude(courseModule => courseModule.Module)
                .ThenInclude(module => module!.Days)
                .ThenInclude(day => day.Events)
                .ToListAsync();

        foreach (var course in courses)
        {
            foreach (var courseModule in course.Modules)
            {
                courseModule.Module.Days = courseModule.Module.Days.OrderBy(d => d.DayNumber).ToList();
                foreach (var day in courseModule.Module.Days)
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
                .ThenInclude(courseModule => courseModule.Module)
                .ThenInclude(module => module!.Days)
                .ThenInclude(day => day.Events)
                .FirstOrDefaultAsync(course => course.Id == id)
                ?? throw new NotFoundByIdException("Course", id);

        foreach (var courseModule in course.Modules)
        {
            courseModule.Module.Days = courseModule.Module.Days.OrderBy(d => d.DayNumber).ToList();
            foreach (var day in courseModule.Module.Days)
            {
                day.Events = day.Events.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).ToList();
            }
        }
        return course;
    }




    private async Task<Course> CreateAppliedCourseAsync(Course appliedCourse)
    {
        await _context.Courses.AddAsync(appliedCourse);
        await _context.SaveChangesAsync();

        var course = await _context.Courses.FirstOrDefaultAsync(course => course.Id == appliedCourse.Id)
            ?? throw new NotFoundByIdException("Course", appliedCourse.Id);

        var currentDate = appliedCourse.StartDate.Date;

        var listOfAppliedModules = new List<Module>();
        int order = 0;
        foreach (var moduleId in course.moduleIds)
        {
            var module = await _context.Modules
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .FirstOrDefaultAsync(module => module.Id == moduleId);

            var appliedModule = new Module()
            {
                Name = module!.Name,
                NumberOfDays = module.NumberOfDays,
                Track = module.Track,
                Order = order++,
                IsApplied = true

            };

            var listOfAppliedDays = new List<Day>();
            foreach (var day in module!.Days)
            {
                var appliedDay = new Day()
                {
                    DayNumber = day.DayNumber,
                    Description = day.Description,
                    IsApplied = true
                };
                listOfAppliedDays.Add(appliedDay);

                var listOfAppliedEvents = new List<Event>();
                foreach (var eventItem in day.Events)
                {
                    var appliedEvent = new Event()
                    {
                        Name = eventItem.Name,
                        StartTime = eventItem.StartTime,
                        EndTime = eventItem.EndTime,
                        Description = eventItem.Description,
                        IsApplied = true
                    };
                    if (appliedEvent.StartTime.Length == 4)
                        appliedEvent.StartTime = "0" + appliedEvent.StartTime;
                    if (appliedEvent.EndTime.Length == 4)
                        appliedEvent.EndTime = "0" + appliedEvent.EndTime;
                    _context.Events.Add(appliedEvent);
                    listOfAppliedEvents.Add(appliedEvent);
                }
                appliedDay.Events = listOfAppliedEvents;
                _context.Days.Add(appliedDay);

                var dateContent = new DateContent()
                {
                    CourseName = appliedCourse.Name!,
                    ModuleName = module.Name,
                    DayOfModule = day.DayNumber,
                    TotalDaysInModule = module.NumberOfDays,
                    Events = listOfAppliedEvents,
                    Color = appliedCourse.Color,
                    appliedCourseId = appliedCourse.Id,
                };
                await _context.DateContent.AddAsync(dateContent);
                await _context.SaveChangesAsync();

                var date = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate);
                if (date == null)
                {
                    date = new CalendarDate()
                    {
                        Date = currentDate,
                        DateContent = new List<DateContent> { dateContent }
                    };
                    await _context.CalendarDates.AddAsync(date);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    date.DateContent.Add(dateContent);
                    _context.CalendarDates.Update(date);
                    await _context.SaveChangesAsync();
                }
                appliedCourse.EndDate = currentDate;
                currentDate = currentDate.AddDays(1);

                if (currentDate.DayOfWeek == DayOfWeek.Saturday && !(day.DayNumber == module.NumberOfDays && moduleId == course.moduleIds.Last()))
                {
                    var dateContentSaturday = new DateContent()
                    {
                        CourseName = appliedCourse.Name!,
                        ModuleName = module.Name + " (weekend)",
                        DayOfModule = 0,
                        TotalDaysInModule = module.NumberOfDays,
                        Events = [],
                        Color = appliedCourse.Color,
                        appliedCourseId = appliedCourse.Id
                    };
                    await _context.DateContent.AddAsync(dateContentSaturday);
                    var dateContentSunday = new DateContent()
                    {
                        CourseName = appliedCourse.Name!,
                        ModuleName = module.Name + " (weekend)",
                        DayOfModule = 0,
                        TotalDaysInModule = module.NumberOfDays,
                        Events = [],
                        Color = appliedCourse.Color,
                        appliedCourseId = appliedCourse.Id
                    };
                    await _context.DateContent.AddAsync(dateContentSunday);
                    await _context.SaveChangesAsync();

                    var dateSaturday = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate);
                    if (dateSaturday == null)
                    {
                        dateSaturday = new CalendarDate()
                        {
                            Date = currentDate,
                            DateContent = new List<DateContent> { dateContentSaturday }
                        };
                        await _context.CalendarDates.AddAsync(dateSaturday);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        dateSaturday.DateContent.Add(dateContentSaturday);
                        _context.CalendarDates.Update(dateSaturday);
                        await _context.SaveChangesAsync();
                    }

                    var dateSunday = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate.AddDays(1));
                    if (dateSunday == null)
                    {
                        dateSunday = new CalendarDate()
                        {
                            Date = currentDate.AddDays(1),
                            DateContent = new List<DateContent> { dateContentSunday }
                        };
                        await _context.CalendarDates.AddAsync(dateSunday);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        dateSunday.DateContent.Add(dateContentSunday);
                        _context.CalendarDates.Update(dateSunday);
                        await _context.SaveChangesAsync();
                    }
                    currentDate = currentDate.AddDays(2);
                }
            }
            appliedModule.Days = listOfAppliedDays;
            _context.Modules.Add(appliedModule);

            listOfAppliedModules.Add(appliedModule);
        }

        if (currentDate.DayOfWeek == DayOfWeek.Monday)
        {
            var dateSaturday = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate.AddDays(-2))!;
            var contentIdToBeDeletedSaturday = dateSaturday!.DateContent.FirstOrDefault(c => c.appliedCourseId == appliedCourse.Id)!.Id;
            var contentToBeDeletedSaturday = await _context.DateContent.FirstOrDefaultAsync(c => c.Id == contentIdToBeDeletedSaturday);
            _context.DateContent.Remove(contentToBeDeletedSaturday!);

            dateSaturday.DateContent.Remove(contentToBeDeletedSaturday!);
            if (dateSaturday.DateContent.Count() == 0)
                _context.CalendarDates.Remove(dateSaturday);
            else
                _context.CalendarDates.Update(dateSaturday);

            var dateSunday = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate.AddDays(-1))!;
            var contentIdToBeDeletedSunday = dateSunday!.DateContent.FirstOrDefault(c => c.appliedCourseId == appliedCourse.Id)!.Id;
            var contentToBeDeletedSunday = await _context.DateContent.FirstOrDefaultAsync(c => c.Id == contentIdToBeDeletedSunday);
            _context.DateContent.Remove(contentToBeDeletedSaturday!);

            dateSunday.DateContent.Remove(contentToBeDeletedSunday!);
            if (dateSunday.DateContent.Count() == 0)
                _context.CalendarDates.Remove(dateSunday);
            else
                _context.CalendarDates.Update(dateSunday);
            await _context.SaveChangesAsync();
        }

        foreach (var moduleElement in listOfAppliedModules)
        {
            var courseModule = new CourseModule
            {
                Course = appliedCourse,
                CourseId = appliedCourse.Id,
                Module = moduleElement,
                ModuleId = moduleElement.Id
            };
            appliedCourse.Modules.Add(courseModule);
        }
        _context.Courses.Update(appliedCourse);
        await _context.SaveChangesAsync();
        return appliedCourse;
    }




    public async Task<Course> CreateAsync(Course course)
    {
        if (course.IsApplied == true)
        {
            return await CreateAppliedCourseAsync(course);
        }
        var modulesInDb = await _context.Modules
                .Where(m => course.moduleIds.Contains(m.Id))
                .ToListAsync();

        course.Modules = new List<CourseModule>();
        foreach (var module in modulesInDb)
        {
            course.Modules.Add(new CourseModule
            {
                CourseId = course.Id,
                ModuleId = module.Id,
                Module = module
            });
        }

        await _context.Courses.AddAsync(course);
        await _context.SaveChangesAsync();
        return course;
    }

    private async Task<Course> UpdateAppliedAsync(int id, Course appliedCourse)
    {
        var appliedCourseToUpdate = await _context.Courses
                .Include(course => course.Modules!)
                .ThenInclude(module => module!.Module)
                .ThenInclude(module => module!.Days)
                .ThenInclude(day => day.Events)
                .AsNoTracking()
                .FirstOrDefaultAsync(ac => ac.Id == id)
                ?? throw new NotFoundByIdException("Course", appliedCourse.Id);

        var courseClearedOfModules = clearCourseModules(appliedCourseToUpdate);
        return courseClearedOfModules;
    }

    private Course clearCourseModules(Course course) // this method removes everything inside Course.Modules (which have the type of CourseModule)
    {
        var courseToClear = _context.Courses
                .Include(course => course.Modules!)
                .ThenInclude(module => module!.Module)
                .ThenInclude(module => module!.Days)
                .ThenInclude(day => day.Events)
                .AsNoTracking()
                .FirstOrDefault(ac => ac.Id == course.Id)
                ?? throw new NotFoundByIdException("Course", course.Id);

        foreach (var courseModule in courseToClear.Modules.Select(m => m.Module!)) 
        {
            clearModuleOfDays(courseModule, courseToClear.Id);
        }
        _context.CourseModules.RemoveRange(courseToClear.Modules); 
        _context.SaveChanges();
        return course;
    }

    private bool clearModuleOfDays(Module module, int courseId)
    {
        Module moduleToClear = _context.Modules
                            .Include(module => module.Days)
                            .ThenInclude(day => day.Events)
                            .ThenInclude(ev => ev.DateContents)
                            .FirstOrDefault(m => m.Id == module.Id)
                            ?? throw new NotFoundByIdException("Module", module.Id);

        foreach (var day in moduleToClear.Days)
        {
            _context.Events.RemoveRange(day.Events);
        }

        _context.Days.RemoveRange(moduleToClear.Days);

        //this part removes dateContent
        var calendarDates =  _context.CalendarDates
            .Include(cd => cd.DateContent) 
            .Where(cd => cd.DateContent.Any(dc => dc.appliedCourseId == courseId));

        foreach (var calendarDate in calendarDates)
        {
            calendarDate.DateContent.RemoveAll(dc => dc.appliedCourseId == courseId);

            if (!calendarDate.DateContent.Any())
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

    public async Task<Course> UpdateAsync(int id, Course course)
    {
        if (course.IsApplied)
        {
            return await UpdateAppliedAsync(id, course);
        }

        var courseToUpdate = await _context.Courses
                .Include(course => course.Modules)
                .ThenInclude(courseModule => courseModule.Module)
                .ThenInclude(module => module!.Days)
                .ThenInclude(day => day.Events)
                .FirstOrDefaultAsync(course => course.Id == id)
                ?? throw new NotFoundByIdException("Course", id);


        var moduleIds = course.moduleIds;
        var modulesInDb = await _context.Modules
                .Where(m => moduleIds.Contains(m.Id))
                .ToListAsync();

        courseToUpdate.Name = course.Name;
        courseToUpdate.NumberOfWeeks = course.NumberOfWeeks;
        courseToUpdate.moduleIds = course.moduleIds;

        courseToUpdate.Modules.Clear();
        foreach (var module in modulesInDb)
        {
            courseToUpdate.Modules.Add(new CourseModule
            {
                CourseId = courseToUpdate.Id,
                ModuleId = module.Id
            });
        }
        _context.Courses.Update(courseToUpdate);
        await _context.SaveChangesAsync();
        return courseToUpdate;

    }
    public async Task<bool> DeleteAsync(int id)
    {

        var course = await _context.Courses
        .Include(c => c.Modules)
        .FirstOrDefaultAsync(c => c.Id == id) ?? throw new NotFoundByIdException("Course", id);

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return true;
    }
}