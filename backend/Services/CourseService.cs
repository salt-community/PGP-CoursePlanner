using System.Runtime.InteropServices;
using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

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

        appliedCourseToUpdate = clearCourseModules(appliedCourseToUpdate); 

        appliedCourseToUpdate.moduleIds = appliedCourse.moduleIds;

        var startDate = appliedCourseToUpdate.StartDate;
        int order = 1;
        foreach (var moduleId in appliedCourseToUpdate.moduleIds)
        {
            startDate = await addModuleToCourse(appliedCourseToUpdate, moduleId, startDate, order);
            order++;
        }

        _context.SaveChanges();
        return appliedCourseToUpdate;
    }

    private async Task<DateTime> addModuleToCourse(Course course, int moduleId, DateTime moduleDate, int order)
    {
        var courseToAddTo = await _context.Courses
                        .Include(course => course.Modules!)
                        .ThenInclude(module => module!.Module)
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

            if (moduleDate.DayOfWeek == DayOfWeek.Saturday && !(day.DayNumber == moduleToAdd.NumberOfDays && moduleId == courseToAddTo.moduleIds.Last()))
            {
                AddWeekendDates(courseToAddTo, moduleToAdd, moduleDate);
                moduleDate = moduleDate.AddDays(2);
            }
            _context.SaveChanges();
        }

        var courseModule = new CourseModule
        {
            CourseId = courseToAddTo.Id,
            Course = courseToAddTo,
            Module = moduleToAdd,
            ModuleId = moduleToAdd.Id,
        };

        _context.CourseModules.Add(courseModule);

        course.Modules.Add(courseModule);
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

    private Course clearCourseModules(Course course)
    {
        foreach (var module in course.Modules.Select(m => m.Module!))
        {
            clearModuleOfDays(module, course.Id);
        }
        _context.CourseModules.RemoveRange(course.Modules);
        _context.SaveChanges();
        return course;
    }

    private bool clearModuleOfDays(Module module, int courseId)
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
        var course = _context.Courses
               .Include(course => course.Modules!)
               .ThenInclude(module => module!.Module)
               .ThenInclude(module => module!.Days)
               .ThenInclude(day => day.Events)
               .AsNoTracking()
               .FirstOrDefault(ac => ac.Id == id)
               ?? throw new NotFoundByIdException("Course", id);

        if (course.IsApplied)
        {
            return await DeleteAppliedAsync(course);
        }
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAppliedAsync(Course course)
    {

        clearCourseModules(course);

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return true;
    }


}