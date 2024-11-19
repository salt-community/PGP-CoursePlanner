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
    public async Task<Course> CreateAsync(Course course)
    {
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
        int totalCourseDays = course.Modules.Sum(m => m.Module.NumberOfDays);

        course.EndDate = course.StartDate.AddDays(totalCourseDays);

        await _context.Courses.AddAsync(course);
        await _context.SaveChangesAsync();
        return course;
    }
    public async Task<Course> UpdateAsync(int id, Course course)
    {
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