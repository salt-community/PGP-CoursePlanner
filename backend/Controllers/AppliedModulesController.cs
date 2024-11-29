
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedModulesController : ControllerBase
    {
        private readonly IService<Module> _service;

        public AppliedModulesController(IService<Module> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<Module>> CreateAppliedModule(Module appliedModule)
        {
            appliedModule.IsApplied = true;
            try{
            await _service.CreateAsync(appliedModule);
            }
            catch(BadRequestException<Module>){
                return BadRequest("Module cannot be created with zero days");
            }
            return CreatedAtAction("GetAppliedModule", new { id = appliedModule.Id }, appliedModule);
        }

        [HttpGet]
        public async Task<ActionResult<List<Module>>> GetAppliedModules() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Module>> GetAppliedModule(int id) => Ok(await _service.GetOneAsync(id));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppliedModule(int id, [FromBody] Module appliedModule)
        {
            await _service.UpdateAsync(id, appliedModule);
            return NoContent();
        }
    }
}