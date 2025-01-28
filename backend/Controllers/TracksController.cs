using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class TracksController(IService<Track> service) : ControllerBase
{
    private readonly IService<Track> _service = service;

    [HttpGet]
    public async Task<ActionResult<List<Track>>> GetTracks() => Ok(await _service.GetAllAsync());
}

