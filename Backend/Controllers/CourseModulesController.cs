using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers;

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
}
