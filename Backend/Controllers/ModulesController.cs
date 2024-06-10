using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

         [HttpGet]
        public async Task<ActionResult<IEnumerable<Module>>> GetTemplates()
        {
            return await _context.Modules
            .Include(t => t.Days)
            .ThenInclude(w => w.Events)
            .ToListAsync();
        }
}
