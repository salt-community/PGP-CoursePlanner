using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppliedCoursesController(IService<Course> service) : ControllerBase
    {
        private readonly IService<Course> _service = service;

        [HttpGet]
        public async Task<List<CourseResponse>> GetAppliedCourses()
        {
            var response = await _service.GetAllAsync();
            return response.Where(x => x.IsApplied == true).Select(c => (CourseResponse)c).ToList();
        }

        [HttpGet("{id}")]

        public async Task<CourseResponse> GetAppliedCourse(int id)
        {
            var response = await _service.GetOneAsync(id);
            return (CourseResponse)response;
        }

        [HttpPost]
        public async Task<ActionResult<CourseResponse>> CreateAppliedCourse(Course appliedCourse)
        {
            appliedCourse.IsApplied = true;
            await _service.CreateAsync(appliedCourse);
            return CreatedAtAction("GetAppliedCourse", new { id = appliedCourse.Id }, (CourseResponse)appliedCourse);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAppliedCourse(int id, [FromBody] Course appliedCourse)
        {
            await _service.UpdateAsync(id, appliedCourse);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppliedCourse(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}