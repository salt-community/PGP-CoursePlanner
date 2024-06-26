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
            //_context.Database.EnsureDeleted();
            var courses = await _context.Courses
                .Include(c => c.Modules)
                    .ThenInclude(cm => cm.Module)
                    .ThenInclude(t => t.Days)
                           .ThenInclude(w => w.Events)
                        .ToListAsync();

            return courses;
            // var courses = await _context.Courses
            //                 .Include(m => m.Modules)
            //                 .ThenInclude(t => t.Days)
            //                 .ThenInclude(w => w.Events)
            //                 .ToListAsync();
            // return courses;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Course> GetOneAsync(int id)
    {
        try
        {
            var course = await _context.Courses
               .Include(c => c.Modules)
                    .ThenInclude(cm => cm.Module)
                    .ThenInclude(t => t.Days)
                        .ThenInclude(w => w.Events)
                        .FirstOrDefaultAsync(c => c.Id == id);
            
            var modules = _context.CourseModules.Where(m => m.CourseId == course.Id).ToList();
            course.Modules = modules;
                        Console.WriteLine(modules.Count());

            return course!;
            // var result = await _context.Courses
            //                 .Include(m => m.Modules)
            //                 .ThenInclude(t => t.Days)
            //                 .ThenInclude(w => w.Events)
            //                 .FirstOrDefaultAsync(course => course.Id == id) ?? null!;
            // return result;
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
            
            Console.WriteLine("!!!!!!!!Count of db " + _context.CourseModules.Count());
            await _context.SaveChangesAsync();
            Console.WriteLine("!!!!!!!!Count of db " + _context.CourseModules.Count());

            courseModulesToAdd = _context.CourseModules.Where(m => m.CourseId == course.Id).ToList();
             Console.WriteLine("!!!!!!!!Count of course modules " + courseModulesToAdd.Count());
            course.Modules = courseModulesToAdd;
            Console.WriteLine("!!!!!!!!Count of course modules " + course.Modules.Count());
            
            _context.Set<Course>().Update(course);
            await _context.SaveChangesAsync();

            var course2 = await _context.Courses
               .Include(c => c.Modules)
                    // .ThenInclude(cm => cm.Module)
                    // .ThenInclude(t => t.Days)
                    //     .ThenInclude(w => w.Events)
                        .FirstOrDefaultAsync(c => c.Id == course.Id);
            Console.WriteLine("!!!!!!!!Count of course modules " + course2.Modules.Count());
            
            return course;
            // var modulesInList = _context.Modules.Where(module => course.Modules.Contains(module)).ToList();
            // course.Modules = modulesInList;

            // await _context.Courses.AddAsync(course);
            // await _context.SaveChangesAsync();
            // return course;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<Course> UpdateAsync(int id, Course course)
    {
        try
        {
            var courseToUpdate = await _context.Courses
            .Include(c => c.Modules)
                .ThenInclude(cm => cm.Module)
                    .ThenInclude(m => m.Days)
                        .ThenInclude(d => d.Events)
                            .FirstOrDefaultAsync(c => c.Id == id);

            if (courseToUpdate == null)
            {
                return null!;
            }

            // Update Course properties
            courseToUpdate.Name = course.Name;
            courseToUpdate.NumberOfWeeks = course.NumberOfWeeks;
            courseToUpdate.moduleIds = course.moduleIds;

            // Update CourseModules relationship
            var moduleIds = course.moduleIds;

            // Get the actual modules from the database
            var modulesInDb = await _context.Modules
                .Where(m => moduleIds.Contains(m.Id))
                .ToListAsync();

            // Clear existing CourseModules
            courseToUpdate.Modules.Clear();

            // Add updated CourseModules
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


            // var courseToUpdate = await _context.Courses
            //             .Include(course => course.Modules)
            //             .ThenInclude(module => module.Days)
            //             .ThenInclude(day => day.Events)
            //             .FirstOrDefaultAsync(m => m.Id == id);

            // if (courseToUpdate == null)
            // {
            //     return null!;
            // }

            // // List<Module> modulesInList = new List<Module>(0);
            // // foreach (var module in course.Modules)
            // // {
            // //     var moduleInDb = await _context.Modules.FirstAsync(m => m.Id == module.Id);
            // //     modulesInList.Add(moduleInDb);
            // // }
            // var modulesInList = _context.Modules.Where(module => course.Modules.Contains(module)).ToList();
            // course.Modules = modulesInList;

            // courseToUpdate = updateCourse(course, courseToUpdate);
            // _context.Set<Course>().Update(courseToUpdate);
            // await _context.SaveChangesAsync();
            // return course;
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

            return true;// var course = await _context.Courses
            //     .Include(course => course.Modules)
            //     .ThenInclude(module => module.Days)
            //     .ThenInclude(day => day.Events)
            //     .FirstAsync(course => course.Id == id);
            // //await _context.Courses.FirstAsync(course => course.Id == id);
            // _context.Courses.Remove(course);
            // await _context.SaveChangesAsync();
            // return true;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }

    private Course updateCourse(Course newCourse, Course course)
    {
        course.Name = newCourse.Name;
        course.NumberOfWeeks = newCourse.NumberOfWeeks;
        //course.Modules = newCourse.Modules;

        return course;
    }
}