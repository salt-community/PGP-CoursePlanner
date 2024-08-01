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
        public async Task<List<AppliedCourse>> GetAllAsync()
        {
            try
            {
                var appliedCourses = await _context.AppliedCourses
                    .Include(course => course.Modules!)
                    .ThenInclude(module => module!.Days)
                    .ThenInclude(day => day.Events)
                .ToListAsync();

                foreach (var course in appliedCourses)
                {
                    course.Modules = course.Modules.OrderBy(m => m.Order).ToList();
                    foreach (var module in course.Modules)
                    {
                        module.Days = module.Days.OrderBy(d => d.DayNumber).ToList();
                        foreach (var day in module.Days)
                        {
                            day.Events = day.Events.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).ToList();
                        }
                    }
                }
                return appliedCourses;
            }
            catch (Exception ex) { Debug.WriteLine(ex.Message); }
            return null!;
        }

        public async Task<AppliedCourse> GetOneAsync(int id)
        {
            var course = await _context.AppliedCourses
                    .Include(course => course.Modules!)
                    .ThenInclude(module => module!.Days)
                    .ThenInclude(day => day.Events)
                    .FirstOrDefaultAsync(course => course.Id == id);

            if (course != null)
            {
                course.Modules = course.Modules.OrderBy(m => m.Order).ToList();
                foreach (var module in course.Modules)
                {
                    module.Days = module.Days.OrderBy(d => d.DayNumber).ToList();
                    foreach (var day in module.Days)
                    {
                        day.Events = day.Events.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).ToList();
                    }
                }
            }

            return course ?? null!;
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

            var listOfAppliedModules = new List<AppliedModule>();
            int order = 0;
            foreach (var moduleId in course.moduleIds)
            {
                var module = await _context.Modules
                            .Include(module => module.Days)
                            .ThenInclude(day => day.Events)
                            .FirstOrDefaultAsync(module => module.Id == moduleId);

                var appliedModule = new AppliedModule()
                {
                    Name = module!.Name,
                    NumberOfDays = module.NumberOfDays,
                    Track = module.Track,
                    Order = order++
                };

                var listOfAppliedDays = new List<AppliedDay>();
                foreach (var day in module!.Days)
                {
                    var appliedDay = new AppliedDay()
                    {
                        DayNumber = day.DayNumber,
                        Description = day.Description
                    };
                    listOfAppliedDays.Add(appliedDay);

                    var listOfAppliedEvents = new List<AppliedEvent>();
                    foreach (var eventItem in day.Events)
                    {
                        var appliedEvent = new AppliedEvent()
                        {
                            Name = eventItem.Name,
                            StartTime = eventItem.StartTime,
                            EndTime = eventItem.EndTime,
                            Description = eventItem.Description
                        };
                        if (appliedEvent.StartTime.Length == 4)
                            appliedEvent.StartTime = "0" + appliedEvent.StartTime;
                        if (appliedEvent.EndTime.Length == 4)
                            appliedEvent.EndTime = "0" + appliedEvent.EndTime;
                        _context.AppliedEvents.Add(appliedEvent);
                        listOfAppliedEvents.Add(appliedEvent);
                    }
                    appliedDay.Events = listOfAppliedEvents;
                    _context.AppliedDays.Add(appliedDay);

                    var dateContent = new DateContent()
                    {
                        CourseName = appliedCourse.Name!,
                        ModuleName = module.Name,
                        DayOfModule = day.DayNumber,
                        TotalDaysInModule = module.NumberOfDays,
                        Events = listOfAppliedEvents,
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
                    appliedCourse.EndDate = currentDate;
                    currentDate = currentDate.AddDays(1);
                    if (currentDate.DayOfWeek == DayOfWeek.Saturday)
                        currentDate = currentDate.AddDays(2);
                }
                appliedModule.Days = listOfAppliedDays;
                _context.AppliedModules.Add(appliedModule);

                listOfAppliedModules.Add(appliedModule);
            }
            appliedCourse.Modules = listOfAppliedModules;
            _context.AppliedCourses.Update(appliedCourse);
            await _context.SaveChangesAsync();
            return appliedCourse;
        }

        public async Task<AppliedCourse> UpdateAsync(int id, AppliedCourse appliedCourse)
        {
            try
            {
                var appliedCourseToUpdate = await _context.AppliedCourses
                        .Include(course => course.Modules!)
                        .ThenInclude(module => module!.Days)
                        .ThenInclude(day => day.Events)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(ac => ac.Id == id);

                if (appliedCourseToUpdate == null)
                {
                    return null!;
                }

                foreach (var oldModule in appliedCourseToUpdate.Modules!)
                {
                    var newModule = appliedCourse.Modules!.FirstOrDefault(d => d.Id == oldModule.Id);
                    if (newModule != null)
                    {
                        foreach (var oldDay in oldModule.Days)
                        {
                            var newDay = newModule!.Days.FirstOrDefault(d => d.Id == oldDay.Id);
                            if (newDay != null)
                            {
                                var eventsToDelete = oldDay.Events
                                    .Where(eventItem => !newDay.Events.Any(e => e.Id == eventItem.Id))
                                    .ToList();
                                foreach (var eventItem in eventsToDelete)
                                {
                                    _context.AppliedEvents.Remove(eventItem);
                                }
                            }
                            else
                            {
                                _context.AppliedDays.Remove(oldDay);
                            }
                        }
                    }
                    else
                    {
                        _context.AppliedModules.Remove(oldModule);
                    }
                }
                await _context.SaveChangesAsync();

                appliedCourseToUpdate.Name = appliedCourse.Name;
                appliedCourseToUpdate.StartDate = appliedCourse.StartDate;
                appliedCourseToUpdate.Color = appliedCourse.Color;
                appliedCourseToUpdate.Modules = appliedCourse.Modules;

                int order = 0;
                foreach (var module in appliedCourseToUpdate.Modules)
                {
                    module.Order = order++;
                }

                _context.ChangeTracker.Clear();
                _context.AppliedCourses.Update(appliedCourseToUpdate);
                await _context.SaveChangesAsync();

                // update appliedCourse, CalendarDays and DateContent
                var moduleIds = appliedCourse.Modules!.Select(m => m.Id);
                var allDateContents = _context.DateContent.Where(dc => dc.appliedCourseId == id);
                foreach (var dc in allDateContents)
                {
                    var cdList = _context.CalendarDates.Where(cd => cd.DateContent.Contains(dc)).ToList();
                    foreach (var cd in cdList)
                    {
                        cd.DateContent.Remove(dc);
                        _context.CalendarDates.Update(cd);
                    }
                    await _context.SaveChangesAsync();
                    //_context.DateContent.Remove(dc);
                    //await _context.SaveChangesAsync();
                }

                var currentDate = appliedCourse.StartDate.Date;
                foreach (var moduleCorrectOrder in appliedCourseToUpdate.Modules.OrderBy(m => m.Order))
                {
                    var module = await _context.AppliedModules
                                .Include(module => module.Days)
                                .ThenInclude(day => day.Events)
                                .FirstOrDefaultAsync(module => module.Id == moduleCorrectOrder.Id);

                    foreach (var day in module!.Days)
                    {
                        var date = await _context.CalendarDates.Include(cm => cm.DateContent).ThenInclude(dc => dc.Events).FirstOrDefaultAsync(date => date.Date.Date == currentDate)!;
                        if (date != null)
                        {
                            var dateContentToBeUpdated = date.DateContent.FirstOrDefault(dc => dc.appliedCourseId == appliedCourse.Id);

                            if (dateContentToBeUpdated != null)
                            {
                                dateContentToBeUpdated.CourseName = appliedCourse.Name!;
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
                                    CourseName = appliedCourse.Name!,
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
                                CourseName = appliedCourse.Name!,
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
                        appliedCourseToUpdate.EndDate = currentDate;
                        currentDate = currentDate.AddDays(1);
                        if (currentDate.DayOfWeek == DayOfWeek.Saturday)
                            currentDate = currentDate.AddDays(2);
                    }
                }
                _context.AppliedCourses.Update(appliedCourseToUpdate);
                await _context.SaveChangesAsync();
                return appliedCourseToUpdate;
            }
            catch (Exception ex) { Debug.WriteLine(ex.Message); }
            return null!;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var appliedCourse = await _context.AppliedCourses
                            .Include(course => course.Modules!)
                            .ThenInclude(module => module!.Days)
                            .ThenInclude(day => day.Events)
                            .FirstOrDefaultAsync(c => c.Id == id);
                if (appliedCourse == null)
                {
                    return false;
                }
                var moduleIds = appliedCourse.Modules!.Select(m => m.Id);

                var currentDate = appliedCourse.StartDate.Date;
                foreach (var moduleId in moduleIds)
                {
                    var module = await _context.AppliedModules
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

    }
}