using System.Linq;
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
    public async Task<ActionResult<IEnumerable<Module>>> GetModules()
    {
        return await _context.Modules
        .Include(t => t.Days)
        .ThenInclude(w => w.Events)
        .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Module>> GetModule(int id)
    {
        var module = await _context.Modules
        .Include(module => module.Days)
        .ThenInclude(day => day.Events).FirstOrDefaultAsync(module => module.Id == id);

        if (module == null)
        {
            return NotFound();
        }
        return module;
    }


    [HttpPost]
    public async Task<ActionResult<Module>> CreateModule(Module module)
    {
        await _context.Modules.AddAsync(module);
        module.Days.Select(day => _context.Days.Add(day));
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetModule", new { id = module.Id }, module);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateModule(int id, [FromBody] Module module)
    {
        if (id != module.Id)
        {
            return BadRequest();
        }

        var moduleToUpdate = await _context.Modules
        .Include(module => module.Days)
        .ThenInclude(day => day.Events)
        .AsNoTracking()
        .FirstOrDefaultAsync(module => module.Id == id);

        if (moduleToUpdate == null)
        {
            return NotFound();
        }

        var days = await _context.Days.Include(day => day.Events).AsNoTracking().ToListAsync();

        var deleteList = moduleToUpdate.Days.Where(day => !module.Days.Any(putDay => day.Id == putDay.Id)).ToList();

        foreach (var day in deleteList)
        {
            _context.Days.Remove(day);
            Console.WriteLine(day.Id);

        }

        moduleToUpdate = module;
        moduleToUpdate.Days = module.Days;

        _context.Modules.Update(moduleToUpdate);
        await _context.SaveChangesAsync();


        return NoContent();
    }

    [HttpDelete("id")]

    public async Task<IActionResult> DeleteModule(int id)
    {
        var moduleToDelete = await _context
                                        .Modules
                                        .Include(module => module.Days)
                                        .ThenInclude(day => day.Events)
                                        .FirstOrDefaultAsync(module => module.Id == id);

        if (moduleToDelete != null)
        {
            _context.Modules.Remove(moduleToDelete);

            await _context.SaveChangesAsync();
        }

        return NoContent();
    }
}
