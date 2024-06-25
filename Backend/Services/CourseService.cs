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
            var modulesInList = _context.Modules.Where(module => course.Modules.Contains(module)).ToList();
            course.Modules = modulesInList;

            await _context.Courses.AddAsync(course);
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
                        .FirstOrDefaultAsync(m => m.Id == id);

            if (courseToUpdate == null)
            {
                return null!;
            }

            // var modulesToDelete = courseToUpdate.Modules
            //     .Where(module => !course.Modules.Any(m => m.Id == module.Id))
            //     .ToList();
            // foreach (var module in modulesToDelete)
            // {
            //     courseToUpdate.Modules.Remove(module);
            //     await _context.SaveChangesAsync();

            // }

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
            var course = await _context.Courses
                .Include(course => course.Modules)
                .ThenInclude(module => module.Days)
                .ThenInclude(day => day.Events)
                .FirstAsync(course => course.Id == id);
            await _context.Courses.FirstAsync(course => course.Id == id);
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