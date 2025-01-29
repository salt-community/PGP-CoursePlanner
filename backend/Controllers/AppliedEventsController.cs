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
public class AppliedEventsController(DataContext context) : ControllerBase
{
    // Removed IService from this controller since it caused errors.
    private DataContext _context = context;

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetAppliedEvent(int id)
    {
        return await _context.Events.FirstOrDefaultAsync(e => e.Id == id)
        ?? throw new NotFoundByIdException("Event", id);
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
}
