using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class ModulesController : ControllerBase
{
    private readonly ModuleService _service;

    public ModulesController(ModuleService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Module>>> GetModules()
    {
        return Ok(await _service.GetAllModulesAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Module>> GetModule(int id)
    {
        var response = await _service.GetSpecificModule(id);

        if (response != null)
        {
            return Ok(response);
        }
        return BadRequest("Module does not exist");
    }


    [HttpPost]
    public async Task<ActionResult<Module>> CreateModule(Module module)
    {
        var response = await _service.CreateModuleAsync(module);
        if (response == null)
        {
            return BadRequest("Unable to create module");
        }

        return CreatedAtAction("GetModule", new { id = module.Id }, module);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateModule(int id, [FromBody] Module module)
    {
        var response = await _service.UpdateModule(module);

        if (response == null)
        {
            return BadRequest("Unable to update module");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteModule(int id)
    {
       if(!await _service.DeleteModule(id))
       {
        return BadRequest("Unable to delete module");
       }

        return NoContent();
    }
    
}
