
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
    
}