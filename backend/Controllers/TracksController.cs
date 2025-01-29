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
    public async Task<IEnumerable<TrackResponse>> GetTracks()
    {
        var response = await _service.GetAllAsync();
        return response.Select(track => (TrackResponse)track);
    }

    [HttpGet("{id}")]
    public async Task<TrackResponse> GetTrack(int id)
    {
        var response = await _service.GetOneAsync(id);
        return (TrackResponse)response;
    }

    [HttpPost]
    public async Task<ActionResult<TrackResponse>> CreateTrack(TrackRequest track)
    {
        var response = await _service.CreateAsync(new Track { Name = track.Name, Color = track.Color });
        return CreatedAtAction("GetTrack", new { id = response.Id }, (TrackResponse)response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTrack(int id, TrackRequest track)
    {
        await _service.UpdateAsync(id, new Track { Name = track.Name, Color = track.Color });
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTrack(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}

