using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using backend.ExceptionHandler.Exceptions;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class CourseModulesController : ControllerBase
{
    private readonly DataContext _context;
    public CourseModulesController( DataContext context)
    {

        _context = context;
    }

    [HttpGet]
    public  IEnumerable<CourseModule> GetAllCourseModules()
    {
        var response = _context.CourseModules;
        return response;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<CourseModule>>> GetCourseModulesByCourse(int id)
    {
        var course =await _context.Courses 
                .Include(c => c.Modules)
                .ThenInclude(cm => cm.Module)
                .FirstOrDefaultAsync(c => c.Id == id) ?? throw new NotFoundByIdException("Course", id);
        return course.Modules;
    }
}
