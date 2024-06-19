using Backend.Data;
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
        try
        {
            var courses = await _context.Courses
                            .Include(m => m.Modules)
                            .ThenInclude(t => t.Days)
                            .ThenInclude(w => w.Events)
                            .ToListAsync();
            return courses;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Course> GetOneAsync(int id)
    {
        try
        {
            return await _context.Courses
                            .Include(m => m.Modules)
                            .ThenInclude(t => t.Days)
                            .ThenInclude(w => w.Events)
                            .FirstOrDefaultAsync(course => course.Id == id) ?? null!;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Course> CreateAsync(Course course)
    {
        try
        {
            await _context.Courses.AddAsync(course);

            course.Modules.ToList().ForEach(module =>
            {
                _context.Modules.Add(module);
                module.Days.ToList().ForEach(day =>
                {
                    _context.Days.Add(day);
                    day.Events.ToList().ForEach(eventItem =>
                    {
                        _context.Events.Add(eventItem);
                    });
                });
            });

            await _context.SaveChangesAsync();
            return course;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Course> UpdateAsync(int id, Course course)
    {
        try
        {
            var courseToUpdate = await _context.Courses
                        .Include(course => course.Modules)
                        .ThenInclude(module => module.Days)
                        .ThenInclude(day => day.Events)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(m => m.Id == id);

            if (courseToUpdate == null)
            {
                return null!;
            }

            var modulesToDelete = courseToUpdate.Modules
                .Where(module => !course.Modules.Any(m => m.Id == module.Id))
                .ToList();
            foreach (var module in modulesToDelete)
            {
                _context.Modules.Remove(module);
            }

            courseToUpdate = updateCourse(course, courseToUpdate);
            _context.Set<Course>().Update(courseToUpdate);
            await _context.SaveChangesAsync();
            return course;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var course = await _context.Courses.FirstAsync(course => course.Id == id);
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }

    private Course updateCourse(Course newCourse, Course course)
    {
        course.Name = newCourse.Name;
        course.NumberOfWeeks = newCourse.NumberOfWeeks;
        course.Modules = newCourse.Modules;

        return course;
    }
}