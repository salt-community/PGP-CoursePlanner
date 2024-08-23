
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
        private readonly IService<AppliedEvent> _service;

        public AppliedEventsController(IService<AppliedEvent> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AppliedModule>> CreateAppliedEvent(AppliedEvent appliedEvent)
        {
            await _service.CreateAsync(appliedEvent);
            return CreatedAtAction("GetAppliedEvent", new { id = appliedEvent.Id }, appliedEvent);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppliedEvent>> GetAppliedEvent(int id)
        {
            var response = await _service.GetOneAsync(id);
            return Ok(response);
        }
    }
}