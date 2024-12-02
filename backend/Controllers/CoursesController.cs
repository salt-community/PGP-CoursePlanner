using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

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
        return Ok(response.Where(x => x.IsApplied == false));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        var response = await _service.GetOneAsync(id);
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<Course>> CreateCourse([FromBody] Course course)
    {
        var response = await _service.CreateAsync(course);
        return CreatedAtAction("GetCourse", new { id = response.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course course)
    {
        await _service.UpdateAsync(id, course);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("ModulesByCourse/{id}")]
    public async Task<IEnumerable<Module>> GetModulesByCourseId(int id)
    {
        var course = await _service.GetOneAsync(id);
        return course.Modules.Select(m => m.Module!).OrderBy(m => course.moduleIds.IndexOf(m.Id));

    }

}