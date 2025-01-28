using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class AppliedEventsController : ControllerBase
{
    // private readonly IService<Event> _service; // I removed IService from this controller since it caused errors.
    private DataContext _context;
    public AppliedEventsController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Event>> CreateAppliedEvent(Event appliedEvent)
    {
        appliedEvent.IsApplied = true;

        _context.ChangeTracker.Clear();
        _context.Entry(appliedEvent).State = EntityState.Added;
        await _context.Events.AddAsync(appliedEvent);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetAppliedEvent", new { id = appliedEvent.Id }, appliedEvent);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetAppliedEvent(int id)
    {
        return await _context.Events.FirstOrDefaultAsync(e => e.Id == id)
        ?? throw new NotFoundByIdException("Event", id);

    }


}
