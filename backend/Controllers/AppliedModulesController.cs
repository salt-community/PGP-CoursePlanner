using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedModulesController(IService<Module> service) : ControllerBase
    {
        private readonly IService<Module> _service = service;

        [HttpGet]
        public async Task<List<Module>> GetAppliedModules() => await _service.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<Module> GetAppliedModule(int id) => await _service.GetOneAsync(id);

        [HttpPost]
        public async Task<ActionResult<Module>> CreateAppliedModule(Module appliedModule)
        {
            appliedModule.IsApplied = true;
            await _service.CreateAsync(appliedModule);
            return CreatedAtAction("GetAppliedModule", new { id = appliedModule.Id }, appliedModule);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAppliedModule(int id, [FromBody] Module appliedModule)
        {
            await _service.UpdateAsync(id, appliedModule);
            return NoContent();
        }
    }
}