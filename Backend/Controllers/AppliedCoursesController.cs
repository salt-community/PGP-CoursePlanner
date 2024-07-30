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
            var response = await _service.CreateAsync(appliedCourse);
            if (response == null)
            {
                return BadRequest("Unable to create appliedCourse");
            }
            return CreatedAtAction("GetAppliedCourse", new { id = appliedCourse.Id }, appliedCourse);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<AppliedCourse>> GetAppliedCourse(int id)
        {
            var response = await _service.GetOneAsync(id);
            if (response != null)
            {
                return Ok(response);
            }
            return NotFound("Applied course does not exist");
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
            if (!await _service.DeleteAsync(id))
            {
                return BadRequest("Unable to delete applied course");
            }
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] AppliedCourse appliedCourse)
        {
            var response = await _service.UpdateAsync(id, appliedCourse);
            if (response == null)
            {
                return BadRequest("Unable to update course");
            }
            return NoContent();
        }

    }
}