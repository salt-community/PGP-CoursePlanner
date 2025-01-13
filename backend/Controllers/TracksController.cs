using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;
[Authorize]
[ApiController]
[Route("[controller]")]
public class TracksController(DataContext context) : ControllerBase 
{
    private readonly DataContext _context = context;

    [HttpGet]
    public List<Track> GetTracks()
    {
       return _context.Tracks.ToList();
    }
}

