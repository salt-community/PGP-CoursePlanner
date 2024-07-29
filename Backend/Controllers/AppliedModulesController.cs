
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedModulesController : ControllerBase
    {
        private readonly IService<AppliedModule> _service;

        public AppliedModulesController(IService<AppliedModule> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AppliedModule>> CreateAppliedModule(AppliedModule appliedModule)
        {
            var response = await _service.CreateAsync(appliedModule);
            if (response == null)
            {
                return BadRequest("Unable to create appliedModule");
            }
            return CreatedAtAction("GetAppliedModule", new { id = appliedModule.Id }, appliedModule);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<AppliedModule>> GetAppliedModule(int id)
        {
            var response = await _service.GetOneAsync(id);
            if (response != null)
            {
                return Ok(response);
            }
            return NotFound("Applied module does not exist");
        }

    }
}