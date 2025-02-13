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
        public async Task<IEnumerable<CourseResponse>> GetAppliedCourses()
        {
            var response = await _service.GetAllAsync();
            return response.Where(x => x.IsApplied == true).Select(c => (CourseResponse)c);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<CourseResponse>> GetAppliedCourse(int id)
        {
            var response = await _service.GetOneAsync(id);
            return Ok((CourseResponse)response);
        }

        [HttpPost]
        public async Task<ActionResult<CourseResponse>> CreateAppliedCourse(CourseRequest courseRequest)
        {
            courseRequest.IsApplied = true;

            var course = new Course
            {
                Track = courseRequest.Track,
                Name = courseRequest.Name,
                StartDate = courseRequest.StartDate,
                EndDate = courseRequest.EndDate,
                NumberOfWeeks = courseRequest.NumberOfWeeks,
                Modules = courseRequest.Modules.Select(m => new Module
                {
                    Name = m.Module!.Name,
                    NumberOfDays = m.Module.NumberOfDays,
                    Days = m.Module.Days,
                    Tracks = m.Module.Tracks,
                    Order = m.Module.Order,
                    IsApplied = m.Module.IsApplied,
                    StartDate = m.Module.StartDate,
                    CreationDate = m.Module.CreationDate
                }).ToList(),
                ModuleIds = courseRequest.ModuleIds,
                IsApplied = courseRequest.IsApplied,
                MiscellaneousEvents = courseRequest.MiscellaneousEvents,
                CreationDate = courseRequest.CreationDate,
                Color = courseRequest.Color
            };

            await _service.CreateAsync(course);
            return CreatedAtAction("GetAppliedCourse", new { id = course.Id }, (CourseResponse)course);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAppliedCourse(int id, CourseRequest courseRequest)
        {
            var course = new Course
            {
                Track = courseRequest.Track,
                Name = courseRequest.Name,
                StartDate = courseRequest.StartDate,
                EndDate = courseRequest.EndDate,
                NumberOfWeeks = courseRequest.NumberOfWeeks,
                Modules = courseRequest.Modules.Select(m => new Module
                {
                    Name = m.Module!.Name,
                    NumberOfDays = m.Module.NumberOfDays,
                    Days = m.Module.Days,
                    Tracks = m.Module.Tracks,
                    Order = m.Module.Order,
                    IsApplied = m.Module.IsApplied,
                    StartDate = m.Module.StartDate,
                    CreationDate = m.Module.CreationDate
                }).ToList(),
                ModuleIds = courseRequest.ModuleIds,
                IsApplied = courseRequest.IsApplied,
                MiscellaneousEvents = courseRequest.MiscellaneousEvents,
                CreationDate = courseRequest.CreationDate,
                Color = courseRequest.Color
            };

            await _service.UpdateAsync(id, course);
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