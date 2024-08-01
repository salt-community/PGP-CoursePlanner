using Backend.Data;
using Backend.ExceptionHandler.Exceptions;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Backend.Services;

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
        return courses;

    }
    public async Task<Course> GetOneAsync(int id)
    {
        var course = await _context.Courses
           .Include(course => course.Modules)
                .ThenInclude(courseModule => courseModule.Module)
                .ThenInclude(module => module!.Days)
                .ThenInclude(day => day.Events)
                .FirstOrDefaultAsync(course => course.Id == id);
        return course ?? throw new NotFoundByIdException("Course", id);
    }
    public async Task<Course> CreateAsync(Course course)
    {
        var moduleIds = course.moduleIds;

        List<CourseModule> courseModulesToAdd = [];
        course.Modules = courseModulesToAdd;
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        foreach (var moduleId in moduleIds)
        {
            _context.CourseModules.Add(new CourseModule
            {
                Course = course,
                CourseId = course.Id,
                Module = _context.Modules.First(m => m.Id == moduleId),
                ModuleId = moduleId
            });
        }
        await _context.SaveChangesAsync();

        courseModulesToAdd = _context.CourseModules.Where(m => m.CourseId == course.Id).ToList();
        course.Modules = courseModulesToAdd;
        _context.Set<Course>().Update(course);
        await _context.SaveChangesAsync();

        return course;

    }
    public async Task<Course> UpdateAsync(int id, Course course)
    {
        try
        {
            var courseToUpdate = await _context.Courses
                    .Include(course => course.Modules)
                    .ThenInclude(courseModule => courseModule.Module)
                    .ThenInclude(module => module!.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(course => course.Id == id);

            if (courseToUpdate == null)
            {
                return null!;
            }

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

            // update appliedCourse, CalendarDays and DateContent
            var appliedCourses = _context.AppliedCourses.Where(ac => ac.CourseId == id).ToList();
            if (appliedCourses.Count() > 0)
            {
                foreach (var appliedCourse in appliedCourses)
                {
                    var allDateContents = _context.DateContent.Where(dc => dc.appliedCourseId == appliedCourse.Id);
                    foreach (var dc in allDateContents)
                    {
                        _context.DateContent.Remove(dc);
                        var cdList = _context.CalendarDates.Where(cd => cd.DateContent.Contains(dc)).ToList();
                        foreach (var cd in cdList)
                        {
                            cd.DateContent.Remove(dc);
                            _context.CalendarDates.Update(cd);
                        }
                        await _context.SaveChangesAsync();
                    }

                    var currentDate = appliedCourse.StartDate.Date;

                    foreach (var moduleId in courseToUpdate.moduleIds)
                    {
                        var module = await _context.Modules
                                    .Include(module => module.Days)
                                    .ThenInclude(day => day.Events)
                                    .FirstOrDefaultAsync(module => module.Id == moduleId);

                        foreach (var day in module!.Days)
                        {
                            var date = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate)!;
                            if (date != null)
                            {
                                var dateContentToBeUpdated = date.DateContent.FirstOrDefault(dc => dc.appliedCourseId == appliedCourse.Id);

                                if (dateContentToBeUpdated != null)
                                {
                                    dateContentToBeUpdated.CourseName = courseToUpdate.Name;
                                    dateContentToBeUpdated.ModuleName = module.Name;
                                    dateContentToBeUpdated.DayOfModule = day.DayNumber;
                                    dateContentToBeUpdated.TotalDaysInModule = module.NumberOfDays;
                                    dateContentToBeUpdated.Events = day.Events;
                                    _context.DateContent.Update(dateContentToBeUpdated);
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    var dateContent = new DateContent()
                                    {
                                        CourseName = courseToUpdate.Name,
                                        ModuleName = module.Name,
                                        DayOfModule = day.DayNumber,
                                        TotalDaysInModule = module.NumberOfDays,
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
                                    CourseName = courseToUpdate.Name,
                                    ModuleName = module.Name,
                                    DayOfModule = day.DayNumber,
                                    TotalDaysInModule = module.NumberOfDays,
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
            return courseToUpdate;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var course = await _context.Courses
            .Include(c => c.Modules)
            .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                return false;
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            // update appliedCourse, CalendarDays and DateContent
            var appliedCourses = _context.AppliedCourses.Where(ac => ac.CourseId == id).ToList();
            if (appliedCourses.Count() > 0)
            {
                foreach (var appliedCourse in appliedCourses)
                {
                    var allDateContents = _context.DateContent.Where(dc => dc.appliedCourseId == appliedCourse.Id);
                    foreach (var dc in allDateContents)
                    {
                        _context.DateContent.Remove(dc);
                        var cdList = _context.CalendarDates.Where(cd => cd.DateContent.Contains(dc)).ToList();
                        foreach (var cd in cdList)
                        {
                            cd.DateContent.Remove(dc);
                            _context.CalendarDates.Update(cd);
                        }
                        await _context.SaveChangesAsync();
                    }
                    _context.AppliedCourses.Remove(appliedCourse);
                    await _context.SaveChangesAsync();
                }
            }

            return true;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }
}