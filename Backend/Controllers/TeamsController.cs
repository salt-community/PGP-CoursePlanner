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

    private readonly IService<Team> _service;
    public TeamsController(IService<Team> service)
    {
        _service = service;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
    {
        var response = await _service.GetAllAsync();
        return Ok(response);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> GetTeam(int id)
    {
        var response = await _service.GetOneAsync(id);
        if (response != null)
        {
            return Ok(response);
        }
        return NotFound("Team does not exist");
    }
}