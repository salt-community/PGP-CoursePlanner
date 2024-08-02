using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedCoursesController : ControllerBase
    {
        private readonly IService<AppliedCourse> _service;

        public AppliedCoursesController(IService<AppliedCourse> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AppliedCourse>> CreateAppliedCourse(AppliedCourse appliedCourse)
        {
            await _service.CreateAsync(appliedCourse);
            return CreatedAtAction("GetAppliedCourse", new { id = appliedCourse.Id }, appliedCourse);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<AppliedCourse>> GetAppliedCourse(int id)
        {
            var response = await _service.GetOneAsync(id);
            return Ok(response);

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetAppliedCourses()
        {
            var response = await _service.GetAllAsync();
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppliedCourse(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppliedCourse(int id, [FromBody] AppliedCourse appliedCourse)
        {
            await _service.UpdateAsync(id, appliedCourse);
            return NoContent();
        }
    }
}