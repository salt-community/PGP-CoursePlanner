using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

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
    public async Task<ActionResult<IEnumerable<ModuleResponse>>> GetModules()
    {
        var response = await _service.GetAllAsync();
        var moduleResponse = response.Select(m => new ModuleResponse(m)).ToList();
        return Ok(moduleResponse.Where(x => x.IsApplied == false));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Module>> GetModule(int id)
    {
        var response = await _service.GetOneAsync(id);
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<Module>> CreateModule(Module module)
    {
        var response = await _service.CreateAsync(module);
        return CreatedAtAction("GetModule", new { id = response.Id }, response);
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