
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
            await _service.CreateAsync(appliedModule);
            return CreatedAtAction("GetAppliedModule", new { id = appliedModule.Id }, appliedModule);
        }

        [HttpGet]
        public async Task<ActionResult<List<AppliedModule>>> GetAppliedModules() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<AppliedModule>> GetAppliedModule(int id) => Ok(await _service.GetOneAsync(id));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppliedModule(int id, [FromBody] AppliedModule appliedModule)
        {
            await _service.UpdateAsync(id, appliedModule);
            return NoContent();
        }
    }
}