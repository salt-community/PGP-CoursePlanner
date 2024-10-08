using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class CoursesController : ControllerBase
{
    private readonly IService<Course> _service;

    public CoursesController(IService<Course> service)
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
    public async Task<ActionResult<Course>> CreateCourse([FromBody] Course course)
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
        var response = await _service.UpdateAsync(id, course);
        if (response == null)
        {
            return BadRequest("Unable to update course");
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        if (!await _service.DeleteAsync(id))
        {
            return BadRequest("Unable to delete course");
        }
        return NoContent();
    }
}