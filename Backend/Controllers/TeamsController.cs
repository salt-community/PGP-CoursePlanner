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
    [HttpPost]
    public async Task<ActionResult<Team>> CreateTeam([FromBody] Team team)
    {
        var response = await _service.CreateAsync(team);
        if (response == null)
        {
            return BadRequest("Unable to create team");
        }
        return CreatedAtAction("GetTeam", new { id = team.Id }, team);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(int id, [FromBody] Team team)
    {
        var response = await _service.UpdateAsync(id, team);
        if (response == null)
        {
            return BadRequest("Unable to update team");
        }
        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        if (!await _service.DeleteAsync(id))
        {
            return BadRequest("Unable to delete team");
        }
        return NoContent();
    }
}