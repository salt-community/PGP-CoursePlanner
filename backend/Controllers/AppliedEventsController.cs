
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedEventsController : ControllerBase
    {
        private readonly IService<Event> _service;

        public AppliedEventsController(IService<Event> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<Event>> CreateAppliedEvent(Event appliedEvent)
        {
            appliedEvent.IsApplied = true;
            await _service.CreateAsync(appliedEvent);
            return CreatedAtAction("GetAppliedEvent", new { id = appliedEvent.Id }, appliedEvent);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetAppliedEvent(int id)
        {
            return await _service.GetOneAsync(id);

        }
    }
}