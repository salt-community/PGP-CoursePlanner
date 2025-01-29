using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using backend.Models.DTOs;
using backend.ExceptionHandler.Exceptions;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class CoursesController(IService<Course> service) : ControllerBase
{
    private readonly IService<Course> _service = service;

    [HttpGet]
    public async Task<IEnumerable<CourseResponse>> GetCourses()
    {
        var response = await _service.GetAllAsync();
        return response.Where(x => x.IsApplied == false).Select(c => (CourseResponse)c);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseResponse>> GetCourse(int id)
    {
        try
        {
            var response = await _service.GetOneAsync(id);
            return Ok((CourseResponse)response);
        }
        catch (NotFoundByIdException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<CourseResponse>> CreateCourse([FromBody] Course course)
    {
        var response = await _service.CreateAsync(course);
        return CreatedAtAction("GetCourse", new { id = response.Id }, (CourseResponse)response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCourse(int id, [FromBody] Course course)
    {
        try
        {
            await _service.UpdateAsync(id, course);
            return NoContent();
        }
        catch (NotFoundByIdException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCourse(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("ModulesByCourse/{id}")]
    public async Task<IEnumerable<ModuleResponse>> GetModulesByCourseId(int id)
    {
        var course = await _service.GetOneAsync(id);
        return course.Modules.Select(m => m.Module!).OrderBy(m => course.moduleIds.IndexOf(m.Id)).Select(m => (ModuleResponse)m);
    }
}