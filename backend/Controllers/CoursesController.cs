using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using backend.Models.DTOs;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class CoursesController(IService<Course> service) : ControllerBase
{
    private readonly IService<Course> _service = service;

    [HttpGet]
    public async Task<IEnumerable<CourseResponse>> GetCourses()
    {
        var response = await _service.GetAllAsync();
        return response.Where(x => x.IsApplied == false).Select(c => (CourseResponse)c);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseResponse>> GetCourse(int id)
    {
        var response = await _service.GetOneAsync(id);
        return Ok((CourseResponse)response);
    }

    [HttpPost]
    public async Task<ActionResult<CourseResponse>> CreateCourse(CourseRequest courseRequest)
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

        var response = await _service.CreateAsync(course);
        return CreatedAtAction("GetCourse", new { id = response.Id }, (CourseResponse)response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCourse(int id, CourseRequest courseRequest)
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
    public async Task<ActionResult> DeleteCourse(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
    [HttpGet("ModulesByCourse/{id}")]
    public async Task<IEnumerable<ModuleResponse>> GetModulesByCourseId(int id)
    {
        var course = await _service.GetOneAsync(id);
        return course.Modules.OrderBy(m => course.ModuleIds.IndexOf(m.Id)).Select(m => (ModuleResponse)m);
    }
}