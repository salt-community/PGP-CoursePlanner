
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Backend.Services;

namespace Backend.Controllers;


[ApiController]
[Route("[controller]")]
public class CourseController : ControllerBase
{
    private readonly IService<Course> _service;

    public CourseController(IService<Course> service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
    {
        var response = await _service.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        var response = await _service.GetOneAsync(id);
        if (response != null)
        {
            return Ok(response);
        }
        return NotFound("Course does not exist");
    }

    [HttpPost]
    public async Task<IActionResult> CreateCourse([FromBody] Course course)
    {
        var response = await _service.CreateAsync(course);
        if (response == null)
        {
            return BadRequest("Unable to create course");
        }
        return CreatedAtAction("GetCourse", new { id = course.Id }, course);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course course)
    {
        var response = await _service.UpdateAsync(course);
        if (response == null)
        {
            return BadRequest("Unable to update course");
        }
        return NoContent();
    }

    // [HttpDelete("{id}")]
    // public async Task<ActionResult> DeleteCourse(int id)
    // {
    //     var course = await _context.Courses.FindAsync(id);
    //     if (course == null)
    //     {
    //         return NotFound();
    //     }
    //     _context.Courses.Remove(course);
    //     await _context.SaveChangesAsync();
    //     return NoContent();
    // }
    // private bool CourseExists(int id)
    // {
    //     return _context.Courses.Any(e => e.Id == id);
    // }
    //evy är en mört

}