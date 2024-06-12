
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Backend.Controllers;


[ApiController]
[Route("[controller]")]
public class CourseController : ControllerBase
{
    private readonly DataContext _context;

    public CourseController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
    {
        return await _context.Courses
        .Include(m => m.Modules)
        .ThenInclude(t => t.Days)
        .ThenInclude(w => w.Events).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        var course = await _context.Courses
         .Include(m => m.Modules)
         .ThenInclude(t => t.Days)
         .ThenInclude(w => w.Events)
         .FirstOrDefaultAsync(course => course.Id == id);
        if (course == null)
        {
            return NotFound();
        }
        return course;

    }
    [HttpPost]
    public async Task<IActionResult> CreateCourse([FromBody] Course course)
    {
        if (course == null)
        {
            return BadRequest("Course is null.");
        }

        await _context.Courses.AddAsync(course);

        // Add related entities using LINQ-like syntax with ToList to ensure compatibility
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

        return CreatedAtAction("GetCourse", new { id = course.Id }, course);
    }



}