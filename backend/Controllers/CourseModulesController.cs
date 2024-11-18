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
    public async Task<ActionResult<IEnumerable<Course>>> GetCourseModules(int id)
    {
        var response = await _service.GetOneAsync(id);
        return Ok(response);
    }
}
