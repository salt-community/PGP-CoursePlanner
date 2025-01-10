using System.Runtime.InteropServices;
using backend.Controllers;
using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
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
        // _context.Courses.Add(appliedCourse);
        // var startDate = appliedCourse.StartDate;
        // _context.SaveChanges();

        // int order = 1;
        // foreach (var moduleId in appliedCourse.moduleIds)
        // {
        //     startDate = await addModuleToCourse(appliedCourse, moduleId, startDate, order);
        //     order++;
        // }
        // appliedCourse.EndDate = calculateEndDate(appliedCourse);

        // _context.SaveChanges();
        // return appliedCourse;
       return await UpdateAppliedAsync(0, appliedCourse);

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

    // private async Task<Course> UpdateAppliedAsync(int id, Course appliedCourse)
    // {
    //     var appliedCourseToUpdate = await _context.Courses
    //             .Include(course => course.Modules!)
    //             .ThenInclude(module => module!.Module)
    //             .ThenInclude(module => module!.Days)
    //             .ThenInclude(day => day.Events)

                
    //             .FirstOrDefaultAsync(ac => ac.Id == id)
    //             ?? throw new NotFoundByIdException("Course", appliedCourse.Id);

    //     appliedCourseToUpdate = clearCourseModules(appliedCourseToUpdate);

    //     appliedCourseToUpdate.moduleIds = appliedCourse.moduleIds;
    //     appliedCourseToUpdate.StartDate = appliedCourse.StartDate;
    //     appliedCourseToUpdate.Name = appliedCourse.Name;

    //     var startDate = appliedCourseToUpdate.StartDate;
    //     int order = 1;
    //     foreach (var moduleId in appliedCourseToUpdate.moduleIds)
    //     {
    //         startDate = await addModuleToCourse(appliedCourseToUpdate, moduleId, startDate, order);
    //         order++;
    //     }
    //     appliedCourseToUpdate.EndDate = calculateEndDate(appliedCourseToUpdate);
    //     _context.SaveChanges();
    //     return appliedCourseToUpdate;
    // }

    private async Task<Course> UpdateAppliedAsync(int id, Course appliedCourse)
    {
        var appliedCourseToUpdate = await _context.Courses
            .Include(c => c.Modules)
                .ThenInclude(cm => cm.Module)
                .ThenInclude(m => m.Days)
                .ThenInclude(d => d.Events)
            .FirstOrDefaultAsync(c => c.Id == id)
            ?? throw new NotFoundByIdException("Course", id);

        appliedCourseToUpdate.Name = appliedCourse.Name;
        appliedCourseToUpdate.StartDate = appliedCourse.StartDate;
        appliedCourseToUpdate.EndDate = appliedCourse.EndDate;
        appliedCourseToUpdate.NumberOfWeeks = appliedCourse.NumberOfWeeks;
        appliedCourseToUpdate.Color = appliedCourse.Color;
        appliedCourseToUpdate.IsApplied = appliedCourse.IsApplied;

        var incomingModuleIds = appliedCourse.Modules.Select(m => m.Module.Id).ToList();

        var modulesToRemove = appliedCourseToUpdate.Modules
            .Where(cm => !incomingModuleIds.Contains(cm.ModuleId))
            .ToList();
        _context.CourseModules.RemoveRange(modulesToRemove);

        foreach (var module in appliedCourse.Modules)
        {
            var existingModule = appliedCourseToUpdate.Modules
                .FirstOrDefault(cm => cm.ModuleId == module.Module.Id)?.Module;

            if (existingModule != null)
            {
                existingModule.Name = module.Module.Name;
                existingModule.NumberOfDays = module.Module.NumberOfDays;
                existingModule.Track = module.Module.Track;
                existingModule.Order = module.Module.Order;
                existingModule.IsApplied = module.Module.IsApplied;

                var incomingDays = module.Module.Days;

                var daysToRemove = existingModule.Days
                    .Where(d => !incomingDays.Any(incoming => incoming.Id == d.Id))
                    .ToList();
                _context.Days.RemoveRange(daysToRemove);

                foreach (var day in incomingDays)
                {
                    if (day.Id == 0)
                    {
                        existingModule.Days.Add(new Day
                        {
                            DayNumber = day.DayNumber,
                            Description = day.Description,
                            IsApplied = day.IsApplied,
                            Events = day.Events.Select(e => new Event
                            {
                                Name = e.Name,
                                StartTime = e.StartTime,
                                EndTime = e.EndTime,
                                Description = e.Description,
                                IsApplied = e.IsApplied
                            }).ToList()
                        });
                    }
                    else
                    {
                        var existingDay = existingModule.Days.FirstOrDefault(d => d.Id == day.Id);
                        if (existingDay != null)
                        {
                            existingDay.DayNumber = day.DayNumber;
                            existingDay.Description = day.Description;
                            existingDay.IsApplied = day.IsApplied;

                            var incomingEvents = day.Events;

                            var eventsToRemove = existingDay.Events
                                .Where(e => !incomingEvents.Any(incoming => incoming.Id == e.Id))
                                .ToList();
                            _context.Events.RemoveRange(eventsToRemove);

                            foreach (var eventObj in incomingEvents)
                            {
                                if (eventObj.Id == 0)
                                {
                                    existingDay.Events.Add(new Event
                                    {
                                        Name = eventObj.Name,
                                        StartTime = eventObj.StartTime,
                                        EndTime = eventObj.EndTime,
                                        Description = eventObj.Description,
                                        IsApplied = eventObj.IsApplied
                                    });
                                }
                                else
                                {
                                    var existingEvent = existingDay.Events.FirstOrDefault(e => e.Id == eventObj.Id);
                                    if (existingEvent != null)
                                    {
                                        existingEvent.Name = eventObj.Name;
                                        existingEvent.StartTime = eventObj.StartTime;
                                        existingEvent.EndTime = eventObj.EndTime;
                                        existingEvent.Description = eventObj.Description;
                                        existingEvent.IsApplied = eventObj.IsApplied;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                var newModule = new Module
                {
                    Name = module.Module.Name,
                    NumberOfDays = module.Module.NumberOfDays,
                    Track = module.Module.Track,
                    Order = module.Module.Order,
                    IsApplied = module.Module.IsApplied,
                    Days = module.Module.Days.Select(day => new Day
                    {
                        DayNumber = day.DayNumber,
                        Description = day.Description,
                        IsApplied = day.IsApplied,
                        Events = day.Events.Select(e => new Event
                        {
                            Name = e.Name,
                            StartTime = e.StartTime,
                            EndTime = e.EndTime,
                            Description = e.Description,
                            IsApplied = e.IsApplied
                        }).ToList()
                    }).ToList()
                };

                _context.Modules.Add(newModule);
                appliedCourseToUpdate.Modules.Add(new CourseModule
                {
                    CourseId = appliedCourseToUpdate.Id,
                    Module = newModule
                });
            }
        }

        await _context.SaveChangesAsync();

        return appliedCourseToUpdate;
    }



    private DateTime calculateEndDate(Course course)
    {
        var numberOfDays = _context.CalendarDates
            .Include(cd => cd.DateContent)
            .Where(cd => cd.DateContent.Any(dc => dc.appliedCourseId == course.Id)).Count();
        
        if(numberOfDays == 0) return course.StartDate;
        
        return course.StartDate.AddDays(numberOfDays - 1).Date;
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