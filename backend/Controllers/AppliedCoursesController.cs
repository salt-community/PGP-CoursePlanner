using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
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
        public async Task<ActionResult<CourseResponse>> CreateAppliedCourse(Course appliedCourse)
        {
            appliedCourse.IsApplied = true;
            await _service.CreateAsync(appliedCourse);
            return CreatedAtAction("GetAppliedCourse", new { id = appliedCourse.Id }, (CourseResponse) appliedCourse);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<CourseResponse>> GetAppliedCourse(int id)
        {
            var response = await _service.GetOneAsync(id);
            return Ok((CourseResponse)response);

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseResponse>>> GetAppliedCourses()
        {
            var response = await _service.GetAllAsync();
            return Ok(response.Where(x => x.IsApplied == true).Select(c => (CourseResponse) c));
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