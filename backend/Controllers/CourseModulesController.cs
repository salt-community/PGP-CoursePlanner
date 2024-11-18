using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class CourseModulesController : ControllerBase
{
    private readonly IService<Course> _service;
    public CourseModulesController(IService<Course> service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Course>>> GetAllCourseModules()
    {
        var response = await _service.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<Module>>> GetCourseModulesByCourse(int id)
    {
        var course = await _service.GetOneAsync(id);
        return Ok(course.Modules.Select(m => m.Module));
    }
}
