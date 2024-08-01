using Backend.Data;
using Backend.ExceptionHandler.Exceptions;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Backend.Services;

public class ModuleService : IService<Module>
{
    private readonly DataContext _context;

    public ModuleService(DataContext context)
    {
        _context = context;
    }

    public async Task<List<Module>> GetAllAsync()
    {

        var modules = await _context.Modules
                        .Include(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .ToListAsync();
        return modules;
    }
    public async Task<Module> GetOneAsync(int id)
    {

        return await _context.Modules
                    .Include(module => module.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(module => module.Id == id) ?? throw new NotFoundByIdException("Module", id);

    }
    public async Task<Module> CreateAsync(Module module)
    {

        _context.Modules.Add(module);
        await _context.SaveChangesAsync();
        return module;

    }
    public async Task<Module> UpdateAsync(int id, Module module)
    {

        var moduleToUpdate = await _context.Modules
                    .Include(module => module.Days)
                    .ThenInclude(day => day.Events)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.Id == id) ?? throw new NotFoundByIdException("Module", id);

        foreach (var oldDay in moduleToUpdate.Days)
        {
            var newDay = module.Days.FirstOrDefault(d => d.Id == oldDay.Id);
            if (newDay != null)
            {
                var eventsToDelete = oldDay.Events
                    .Where(eventItem => !newDay.Events.Any(e => e.Id == eventItem.Id))
                    .ToList();
                foreach (var eventItem in eventsToDelete)
                {
                    _context.Events.Remove(eventItem);
                }
            }
            else
            {
                _context.Days.Remove(oldDay);
            }
        }

        moduleToUpdate = updateModule(module, moduleToUpdate);
        _context.Set<Module>().Update(moduleToUpdate);
        await _context.SaveChangesAsync();

        //update AppliedCourse, DateContent, CalendarDate
        var courseIds = _context.Courses.Where(c => c.moduleIds.Contains(id)).Select(c => c.Id);

        foreach (var courseId in courseIds)
        {
            var course = _context.Courses.FirstOrDefault(c => c.Id == courseId);
            var appliedCourses = _context.AppliedCourses.Where(ac => ac.CourseId == courseId).ToList();
            if (appliedCourses.Count() > 0)
            {
                foreach (var appliedCourse in appliedCourses)
                {
                    var allDateContents = _context.DateContent.Where(dc => dc.appliedCourseId == appliedCourse.Id);
                    foreach (var dc in allDateContents)
                    {
                        var cdList = _context.CalendarDates.Where(cd => cd.DateContent.Contains(dc)).ToList();
                        foreach (var cd in cdList)
                        {
                            cd.DateContent.Remove(dc);
                            _context.CalendarDates.Update(cd);

                            _context.DateContent.Remove(dc);
                            await _context.SaveChangesAsync();
                        }

                    }

                    var currentDate = appliedCourse.StartDate.Date;

                    foreach (var moduleId in course!.moduleIds)
                    {
                        var moduleInCourse = await _context.Modules
                                    .Include(module => module.Days)
                                    .ThenInclude(day => day.Events)
                                    .FirstOrDefaultAsync(module => module.Id == moduleId);

                        foreach (var day in moduleInCourse!.Days)
                        {
                            var date = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate)!;
                            if (date != null)
                            {
                                var dateContentToBeUpdated = date.DateContent.FirstOrDefault(dc => dc.appliedCourseId == appliedCourse.Id);

                                if (dateContentToBeUpdated != null)
                                {
                                    dateContentToBeUpdated.CourseName = course.Name;
                                    dateContentToBeUpdated.ModuleName = moduleInCourse.Name;
                                    dateContentToBeUpdated.DayOfModule = day.DayNumber;
                                    dateContentToBeUpdated.TotalDaysInModule = moduleInCourse.NumberOfDays;
                                    dateContentToBeUpdated.Events = day.Events;
                                    _context.DateContent.Update(dateContentToBeUpdated);
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    var dateContent = new DateContent()
                                    {
                                        CourseName = course.Name,
                                        ModuleName = moduleInCourse.Name,
                                        DayOfModule = day.DayNumber,
                                        TotalDaysInModule = moduleInCourse.NumberOfDays,
                                        Events = day.Events,
                                        Color = appliedCourse.Color,
                                        appliedCourseId = appliedCourse.Id
                                    };
                                    await _context.DateContent.AddAsync(dateContent);
                                    await _context.SaveChangesAsync();

                                    date.DateContent.Add(dateContent);
                                    _context.CalendarDates.Update(date);
                                    await _context.SaveChangesAsync();
                                }
                            }
                            else
                            {
                                var dateContent = new DateContent()
                                {
                                    CourseName = course.Name,
                                    ModuleName = moduleInCourse.Name,
                                    DayOfModule = day.DayNumber,
                                    TotalDaysInModule = moduleInCourse.NumberOfDays,
                                    Events = day.Events,
                                    Color = appliedCourse.Color,
                                    appliedCourseId = appliedCourse.Id
                                };
                                await _context.DateContent.AddAsync(dateContent);
                                await _context.SaveChangesAsync();

                                date = new CalendarDate()
                                {
                                    Date = currentDate,
                                    DateContent = new List<DateContent> { dateContent }
                                };
                                await _context.CalendarDates.AddAsync(date);
                                await _context.SaveChangesAsync();
                            }
                            currentDate = currentDate.AddDays(1);
                            if (currentDate.DayOfWeek == DayOfWeek.Saturday)
                                currentDate = currentDate.AddDays(2);
                        }
                    }
                }
            }
        }

        return module;

    }
    public async Task<bool> DeleteAsync(int id)
    {

        var module = await _context.Modules
            .Include(module => module.Days)
            .ThenInclude(day => day.Events)
            .FirstAsync(module => module.Id == id);
        _context.Remove(module);
        await _context.SaveChangesAsync();
        return true;

    }

    private Module updateModule(Module newModule, Module module)
    {
        module.Name = newModule.Name;
        module.NumberOfDays = newModule.NumberOfDays;
        module.Days = newModule.Days;
        module.Track = newModule.Track;

        return module;
    }
}
