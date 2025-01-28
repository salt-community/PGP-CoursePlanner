using backend.Models;
using backend.Models.DTOs;
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
    public async Task<List<TrackResponse>> GetTracks()
    {
        var tracks = await _service.GetAllAsync();
        return [.. tracks.Select(track => (TrackResponse)track)];
    }

    [HttpGet("{id}")]
    public async Task<TrackResponse> GetTrack(int id)
    {
        var track = await _service.GetOneAsync(id);
        return (TrackResponse)track;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTrack(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}

