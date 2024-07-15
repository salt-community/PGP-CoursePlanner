using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class TeamsController : ControllerBase
{

    private readonly IService<Teams> _service;
    public TeamsController(IService<Teams> service)
    {
        _service = service;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Teams>>> GetTeams()
    {
        var response = await _service.GetAllAsync();
        return Ok(response);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Teams>
}