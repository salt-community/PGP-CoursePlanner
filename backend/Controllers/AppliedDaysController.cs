
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedDaysController : ControllerBase
    {
        private readonly IService<AppliedDay> _service;

        public AppliedDaysController(IService<AppliedDay> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AppliedDay>> CreateAppliedDay(AppliedDay appliedDay)
        {
            var response = await _service.CreateAsync(appliedDay);
            if (response == null)
            {
                return BadRequest("Unable to create appliedDay");
            }
            return CreatedAtAction("GetAppliedDay", new { id = appliedDay.Id }, appliedDay);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppliedDay>> GetAppliedDay(int id)
        {
            var response = await _service.GetOneAsync(id);
            if (response != null)
            {
                return Ok(response);
            }
            return NotFound("Applied day does not exist");
        }
    }
}