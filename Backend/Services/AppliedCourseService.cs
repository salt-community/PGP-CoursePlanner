
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AppliedCourseService : IService<AppliedCourse>
    {
        private readonly DataContext _context;

        public AppliedCourseService(DataContext context)
        {
            _context = context;
        }

        public async Task<AppliedCourse> CreateAsync(AppliedCourse appliedCourse)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(course => course.Id == appliedCourse.CourseId);

            if (course == null)
            {
                return null!;
            }

            var currentDate = appliedCourse.StartDate.Date;

            foreach (var moduleId in course.moduleIds)
            {
                var module = await _context.Modules
                            .Include(module => module.Days)
                            .ThenInclude(day => day.Events)
                            .FirstOrDefaultAsync(module => module.Id == moduleId);

                foreach (var day in module!.Days)
                {

                    var dateContent = new DateContent()
                    {
                        CourseName = course.Name,
                        ModuleName = module.Name,
                        DayOfModule = day.DayNumber,
                        TotalDaysInModule = module.NumberOfDays,
                        Events = day.Events
                    };

                    var date = await _context.CalendarDates.FirstOrDefaultAsync(date => date.Date.Date == currentDate);

                    if (date == null)
                    {
                        date = new CalendarDate()
                        {
                            Date = currentDate,
                        };

                        await _context.CalendarDates.AddAsync(date);
                    }

                    date.DateContent.Add(dateContent);

                    await _context.SaveChangesAsync();

                    currentDate = currentDate.AddDays(1);

                }

            }
            await _context.AppliedCourses.AddAsync(appliedCourse);
            await _context.SaveChangesAsync();

            return appliedCourse;
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<AppliedCourse>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<AppliedCourse> GetOneAsync(int id)
        {
            return await _context.AppliedCourses.FirstOrDefaultAsync(course => course.Id == id) ?? null!;
        }

        public Task<AppliedCourse> UpdateAsync(int id, AppliedCourse T)
        {
            throw new NotImplementedException();
        }
    }
}