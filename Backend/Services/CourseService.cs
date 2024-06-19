using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;
using static Backend.Repositories.SpecificRepo;

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
    public async Task<Course> UpdateAsync(Course T)
    {
        try
        {
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }
}