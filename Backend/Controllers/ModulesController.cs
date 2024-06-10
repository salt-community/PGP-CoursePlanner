using Backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class ModulesController : ControllerBase
{
    private readonly DataContext _context;

    public ModulesController(DataContext context)
    {
        _context = context;
    }
}
