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
                .Include(course => course.Modules)
                    .ThenInclude(courseModule => courseModule.Module)
                    .ThenInclude(module => module!.Days)
                    .ThenInclude(day => day.Events)
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
            var course = await _context.Courses
                    .Include(course => course.Modules)
                    .ThenInclude(courseModule => courseModule.Module)
                    .ThenInclude(module => module!.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(course => course.Id == id);
            return course ?? null!;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Course> CreateAsync(Course course)
    {
        try
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
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
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

            return true;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }
}