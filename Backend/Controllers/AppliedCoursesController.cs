
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
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

    }
}