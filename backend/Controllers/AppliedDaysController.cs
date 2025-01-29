using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedDaysController(IService<Day> service) : ControllerBase
    {
        private readonly IService<Day> _service = service;

        [HttpGet("{id}")]
        public async Task<ActionResult<Day>> GetAppliedDay(int id)
        {
            var response = await _service.GetOneAsync(id);
            if (response != null)
            {
                return Ok(response);
            }
            return NotFound("Applied day does not exist");
        }

        [HttpPost]
        public async Task<ActionResult<Day>> CreateAppliedDay(Day appliedDay)
        {
            appliedDay.IsApplied = true;
            var response = await _service.CreateAsync(appliedDay);
            if (response == null)
            {
                return BadRequest("Unable to create appliedDay");
            }
            return CreatedAtAction("GetAppliedDay", new { id = appliedDay.Id }, appliedDay);
        }
    }
}