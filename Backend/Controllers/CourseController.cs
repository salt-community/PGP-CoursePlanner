
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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course course)
    {
        if (id != course.Id)
        {
            return BadRequest();
        }

        _context.Entry(course).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CourseExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
        {
            return NotFound();
        }
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    private bool CourseExists(int id)
    {
        return _context.Courses.Any(e => e.Id == id);
    }


}