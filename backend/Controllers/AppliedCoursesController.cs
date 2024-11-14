using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedCoursesController : ControllerBase
    {
        private readonly IService<Course> _service;

        public AppliedCoursesController(IService<Course> service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<Course>> CreateAppliedCourse(Course appliedCourse)
        {
            appliedCourse.IsApplied = true;
            await _service.CreateAsync(appliedCourse);
            return CreatedAtAction("GetAppliedCourse", new { id = appliedCourse.Id }, appliedCourse);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Course>> GetAppliedCourse(int id)
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
        public async Task<IActionResult> UpdateAppliedCourse(int id, [FromBody] Course appliedCourse)
        {
            await _service.UpdateAsync(id, appliedCourse);
            return NoContent();
        }
    }
}