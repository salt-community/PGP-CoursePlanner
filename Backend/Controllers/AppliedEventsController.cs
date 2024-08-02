
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedEventsController : ControllerBase
    {
        private readonly IService<AppliedEvent> _service;

        public AppliedEventsController(IService<AppliedEvent> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AppliedModule>> CreateAppliedEvent(AppliedEvent appliedEvent)
        {
            var response = await _service.CreateAsync(appliedEvent);
            if (response == null)
            {
                return BadRequest("Unable to create appliedEvent");
            }
            return CreatedAtAction("GetAppliedEvent", new { id = appliedEvent.Id }, appliedEvent);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppliedEvent>> GetAppliedEvent(int id)
        {
            var response = await _service.GetOneAsync(id);
            if (response != null)
            {
                return Ok(response);
            }
            return NotFound("Applied event does not exist");
        }
    }
}