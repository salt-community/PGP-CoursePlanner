using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var _context = new DataContext(
                   serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
        {
            _context.Database.EnsureDeleted();
            _context.Database.Migrate();
            _context.Database.EnsureCreated();

            List<Day> hellWeekDays = [
                new Day{
                    DayNumber = 1,
                    Description = "Introduction",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 2,
                    Description = "Introduction backend",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 3,
                    Description = "Introduction frontend",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 4,
                    Description = "Introduction Database",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 5,
                    Description = "Summary",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15:00",
                            EndTime = "16:00",
                            Description = "Presentation of today's topic",
                            IsApplied = true
                            },
                        new Event{
                            Name = "After Work",
                            StartTime = "17:00",
                            EndTime = "22:00",
                            Description = "Drink and make friends",
                            IsApplied = true
                        }
                    ]
                }
            ];

            List<Day> APIDays = [
                new Day{
                    DayNumber = 1,
                    Description = "Introduction ASP.NET",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15:00",
                            EndTime = "16:00",
                            Description = "Presentation of today's topic",
                            IsApplied = true
                            }],
                },
                new Day{
                    DayNumber = 2,
                    Description = "Testing WebAPI",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 3,
                    Description = "REST",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                }
            ];

            List<Day> reactDays = [
                new Day{
                    DayNumber = 1,
                    Description = "Introduction React",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 2,
                    Description = "React Hooks",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15:00",
                            EndTime = "16:00",
                            Description = "Presentation of today's topic",
                            IsApplied = true
                            }],
                }
            ];

            List<Day> cloudDays = [
                new Day{
                    DayNumber = 1,
                    Description = "Setting up Azure",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 2,
                    Description = "Azure Storage",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            }
                    ]
                },
                new Day{
                    DayNumber = 3,
                    Description = "CI/CD",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9:00",
                            EndTime = "10:00",
                            Description = "Lecture about the topic of today",
                            IsApplied = true
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15:00",
                            EndTime = "16:00",
                            Description = "Presentation of today's topic",
                            IsApplied = true
                            }],
                }];

            string[] module_names = { "Hell Week", "API", "React", "Cloud" };
            int[] module_numOfDays = { 5, 3, 2, 3 };
            List<List<Day>> module_days = [hellWeekDays, APIDays, reactDays, cloudDays];
            List<string[]> module_tracks = [["Java", "Javascript", ".NET"], ["Java"], ["Java", "Javascript"], [".NET"]];

            List<Module> moduleList = new();
            for (var i = 0; i < module_names.Length; i++)
            {
                var module = new Module
                {
                    Name = module_names[i],
                    NumberOfDays = module_numOfDays[i],
                    Days = module_days.ElementAt(i),
                    Track = module_tracks[i]
                };
                _context.Modules.Add(module);
                _context.SaveChanges();
                moduleList.Add(module);
            }

            string[] course_names = { "Java", "JavaScript", "Dotnet" };
            int[] course_numOfWeeks = { 2, 3, 2 };

            var moduleDays = _context.Modules.Select(m => m.Days);

            List<List<int>> course_moduleIds = [[1, 2, 3], [1, 2, 3, 4], [1, 3, 4]];

            for (var i = 0; i < course_names.Length; i++)
            {
                var courseModules = new List<CourseModule>();
                for (int j = 0; j < course_moduleIds[i].Count; j++)
                {
                    var courseModuleElement = new CourseModule
                    {
                        ModuleId = course_moduleIds[i][j],
                        Module = moduleList.First(m => m.Id == course_moduleIds[i][j])
                    };
                    courseModules.Add(courseModuleElement);
                }
                var course = new Course
                {
                    Name = course_names[i],
                    NumberOfWeeks = course_numOfWeeks[i],
                    moduleIds = course_moduleIds[i],
                    Modules = courseModules,
                    IsApplied = false
                };
                _context.Courses.Add(course);
                _context.SaveChanges();
            }
        }
    }
}