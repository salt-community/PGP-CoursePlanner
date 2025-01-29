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
    public async Task<IEnumerable<ModuleResponse>> GetModules()
    {
        var response = await _service.GetAllAsync();
        var moduleResponse = response.Select(m => (ModuleResponse)m).ToList();
        return moduleResponse.Where(x => x.IsApplied == false);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ModuleResponse>> GetModule(int id)
    {
        try
        {
            var response = await _service.GetOneAsync(id);
            return Ok((ModuleResponse)response);
        }
        catch (NotFoundByIdException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<ModuleResponse>> CreateModule(Module module)
    {
        var response = await _service.CreateAsync(module);
        var moduleResponse = new ModuleResponse(response);
        return CreatedAtAction("GetModule", new { id = moduleResponse.Id }, moduleResponse);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateModule(int id, Module module)
    {
        try
        {
            await _service.UpdateAsync(id, module);
            return NoContent();
        }
        catch (NotFoundByIdException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteModule(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}