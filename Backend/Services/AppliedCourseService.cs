
using Backend.Data;
using Backend.Models;

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
            var course = _context.Courses.FirstOrDefault(course => course.Id == appliedCourse.CourseId);

            if (course == null)
            {
                return null!;
            }

            var currentDate = appliedCourse.StartDate;


            foreach (var courseModule in course.Modules)
            {
                foreach (var day in courseModule.Module!.Days)
                {

                    var dateContent = new DateContent()
                    {
                        CourseName = course.Name,
                        ModuleName = courseModule.Module!.Name,
                        DayOfModule = day.DayNumber,
                        TotalDaysInModule = courseModule.Module.NumberOfDays,
                        Events = day.Events
                    };

                    var date = _context.CalendarDates.FirstOrDefault(date => date.Date == currentDate);

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

        public Task<AppliedCourse> GetOneAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<AppliedCourse> UpdateAsync(int id, AppliedCourse T)
        {
            throw new NotImplementedException();
        }
    }
}