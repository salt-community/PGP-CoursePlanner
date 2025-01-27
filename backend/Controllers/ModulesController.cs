using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

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
    public async Task<ActionResult<IEnumerable<ModuleResponse>>> GetModules()
    {
        var response = await _service.GetAllAsync();
        var moduleResponse = response.Select(m => new ModuleResponse(m)).ToList();
        return Ok(moduleResponse.Where(x => x.IsApplied == false));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ModuleResponse>> GetModule(int id)
    {
        var response = await _service.GetOneAsync(id);
        return Ok(new ModuleResponse(response));
    }

    [HttpPost]
    public async Task<ActionResult<ModuleResponse>> CreateModule(Module module)
    {
        var response = await _service.CreateAsync(module);
        var moduleResponse = new ModuleResponse(response);
        return CreatedAtAction("GetModule", new { id = moduleResponse.Id }, moduleResponse);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateModule(int id, [FromBody] Module module)
    {
        await _service.UpdateAsync(id, module);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteModule(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}