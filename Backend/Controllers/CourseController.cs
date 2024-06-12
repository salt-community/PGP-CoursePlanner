
using Backend.Data;
using Microsoft.AspNetCore.Mvc;

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
}
