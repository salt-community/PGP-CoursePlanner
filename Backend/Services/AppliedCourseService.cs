
using System.Diagnostics;
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
            await _context.AppliedCourses.AddAsync(appliedCourse);
            await _context.SaveChangesAsync();

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
                        Events = day.Events,
                        Color = appliedCourse.Color,
                        appliedCourseId = appliedCourse.Id
                    };
                    await _context.DateContent.AddAsync(dateContent);
                    await _context.SaveChangesAsync();

                    var date = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate);
                    if (date == null)
                    {
                        date = new CalendarDate()
                        {
                            Date = currentDate,
                            DateContent = new List<DateContent> { dateContent }
                        };
                        await _context.CalendarDates.AddAsync(date);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        date.DateContent.Add(dateContent);
                        _context.CalendarDates.Update(date);
                        await _context.SaveChangesAsync();
                    }
                    currentDate = currentDate.AddDays(1);
                    if (currentDate.DayOfWeek == DayOfWeek.Saturday)
                        currentDate = currentDate.AddDays(2);
                }
            }
            return appliedCourse;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var appliedCourse = await _context.AppliedCourses
                .FirstOrDefaultAsync(c => c.Id == id);

                if (appliedCourse == null)
                {
                    return false;
                }

                var course = await _context.Courses.FirstOrDefaultAsync(course => course.Id == appliedCourse.CourseId);

                if (course == null)
                {
                    return false;
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
                        var date = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate)!;
                        var contentIdToBeDeleted = date!.DateContent.FirstOrDefault(c => c.appliedCourseId == id)!.Id;
                        var contentToBeDeleted = await _context.DateContent.FirstOrDefaultAsync(c => c.Id == contentIdToBeDeleted);
                        _context.DateContent.Remove(contentToBeDeleted!);

                        date.DateContent.Remove(contentToBeDeleted!);
                        if (date.DateContent.Count() == 0)
                            _context.CalendarDates.Remove(date);
                        else
                            _context.CalendarDates.Update(date);
                        await _context.SaveChangesAsync();

                        currentDate = currentDate.AddDays(1);
                        if (currentDate.DayOfWeek == DayOfWeek.Saturday)
                            currentDate = currentDate.AddDays(2);
                    }
                }
                _context.AppliedCourses.Remove(appliedCourse);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex) { Debug.WriteLine(ex.Message); }
            return false;
        }

        public async Task<List<AppliedCourse>> GetAllAsync()
        {
            try
            {
                var appliedCourses = await _context.AppliedCourses.ToListAsync();
                return appliedCourses;
            }
            catch (Exception ex) { Debug.WriteLine(ex.Message); }
            return null!;
        }

        public async Task<AppliedCourse> GetOneAsync(int id)
        {
            return await _context.AppliedCourses.FirstOrDefaultAsync(course => course.Id == id) ?? null!;
        }

        public async Task<AppliedCourse> UpdateAsync(int id, AppliedCourse appliedCourse)
        {
            try
            {
                var appliedCourseToUpdate = await _context.AppliedCourses.FirstOrDefaultAsync(ac => ac.Id == id);

                if (appliedCourseToUpdate == null)
                {
                    return null!;
                }

                appliedCourseToUpdate.StartDate = appliedCourse.StartDate;
                appliedCourseToUpdate.Color = appliedCourse.Color;

                _context.AppliedCourses.Update(appliedCourseToUpdate);
                await _context.SaveChangesAsync();

                // update appliedCourse, CalendarDays and DateContent
                var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == appliedCourseToUpdate.CourseId);
                var allDateContents = _context.DateContent.Where(dc => dc.appliedCourseId == id);
                foreach (var dc in allDateContents)
                {
                    _context.DateContent.Remove(dc);
                    var cdList = _context.CalendarDates.Where(cd => cd.DateContent.Contains(dc)).ToList();
                    foreach (var cd in cdList)
                    {
                        cd.DateContent.Remove(dc);
                        _context.CalendarDates.Update(cd);
                    }
                    await _context.SaveChangesAsync();
                }

                var currentDate = appliedCourse.StartDate.Date;

                foreach (var moduleId in course!.moduleIds)
                {
                    var module = await _context.Modules
                                .Include(module => module.Days)
                                .ThenInclude(day => day.Events)
                                .FirstOrDefaultAsync(module => module.Id == moduleId);

                    foreach (var day in module!.Days)
                    {
                        var date = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate)!;
                        if (date != null)
                        {
                            var dateContentToBeUpdated = date.DateContent.FirstOrDefault(dc => dc.appliedCourseId == appliedCourse.Id);

                            if (dateContentToBeUpdated != null)
                            {
                                dateContentToBeUpdated.CourseName = course.Name;
                                dateContentToBeUpdated.ModuleName = module.Name;
                                dateContentToBeUpdated.DayOfModule = day.DayNumber;
                                dateContentToBeUpdated.TotalDaysInModule = module.NumberOfDays;
                                dateContentToBeUpdated.Events = day.Events;
                                dateContentToBeUpdated.Color = appliedCourseToUpdate.Color;
                                _context.DateContent.Update(dateContentToBeUpdated);
                                await _context.SaveChangesAsync();
                            }
                            else
                            {
                                var dateContent = new DateContent()
                                {
                                    CourseName = course.Name,
                                    ModuleName = module.Name,
                                    DayOfModule = day.DayNumber,
                                    TotalDaysInModule = module.NumberOfDays,
                                    Events = day.Events,
                                    Color = appliedCourseToUpdate.Color,
                                    appliedCourseId = id
                                };
                                await _context.DateContent.AddAsync(dateContent);
                                await _context.SaveChangesAsync();

                                date.DateContent.Add(dateContent);
                                _context.CalendarDates.Update(date);
                                await _context.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            var dateContent = new DateContent()
                            {
                                CourseName = course.Name,
                                ModuleName = module.Name,
                                DayOfModule = day.DayNumber,
                                TotalDaysInModule = module.NumberOfDays,
                                Events = day.Events,
                                Color = appliedCourseToUpdate.Color,
                                appliedCourseId = id
                            };
                            await _context.DateContent.AddAsync(dateContent);
                            await _context.SaveChangesAsync();

                            date = new CalendarDate()
                            {
                                Date = currentDate,
                                DateContent = new List<DateContent> { dateContent }
                            };
                            await _context.CalendarDates.AddAsync(date);
                            await _context.SaveChangesAsync();
                        }
                        currentDate = currentDate.AddDays(1);
                        if (currentDate.DayOfWeek == DayOfWeek.Saturday)
                            currentDate = currentDate.AddDays(2);
                    }
                }

                return appliedCourseToUpdate;
            }
            catch (Exception ex) { Debug.WriteLine(ex.Message); }
            return null!;
        }
    }
}