using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class ModulesController : ControllerBase
{
    private readonly IService<Module> _service;

    public ModulesController(IService<Module> service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Module>>> GetModules()
    {
        var response = await _service.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Module>> GetModule(int id)
    {
        var response = await _service.GetOneAsync(id);
        if (response != null)
        {
            return Ok(response);
        }
        return NotFound("Module does not exist");
    }

    [HttpPost]
    public async Task<ActionResult<Module>> CreateModule(Module module)
    {
        var response = await _service.CreateAsync(module);
        if (response == null)
        {
            return BadRequest("Unable to create module");
        }
        return CreatedAtAction("GetModule", new { id = module.Id }, module);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateModule(int id, [FromBody] Module module)
    {
        var response = await _service.UpdateAsync(id, module);
        if (response == null)
        {
            return BadRequest("Unable to update module");
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteModule(int id)
    {
        if (!await _service.DeleteAsync(id))
        {
            return BadRequest("Unable to delete module");
        }
        return NoContent();
    }
}