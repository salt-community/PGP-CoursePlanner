using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var _context = new DataContext(
                   serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
        {
            _context.Database.EnsureDeleted(); // Clear the database
            _context.Database.Migrate();
            _context.Database.EnsureCreated(); // Create the database if not exists

            List<Day> hellWeekDays = [
                new Day{
                    DayNumber = 1,
                    Description = "Introduction",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 2,
                    Description = "Introduction Backend",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 3,
                    Description = "Introduction Frontend",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 4,
                    Description = "Introduction Database",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 5,
                    Description = "Summary",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15.00",
                            EndTime = "16.00",
                            Description = "Presentation of today's topic"
                            },
                        new Event{
                            Name = "After Work",
                            StartTime = "17.00",
                            EndTime = "22.00",
                            Description = "Drink and make friends"
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
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15.00",
                            EndTime = "16.00",
                            Description = "Presentation of today's topic"
                            }],
                },
                new Day{
                    DayNumber = 2,
                    Description = "Testing WebAPI",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 3,
                    Description = "REST",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
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
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 2,
                    Description = "React Hooks",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15.00",
                            EndTime = "16.00",
                            Description = "Presentation of today's topic"
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
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 2,
                    Description = "Azure Storage",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            }
                    ]
                },
                new Day{
                    DayNumber = 3,
                    Description = "CI/CD",
                    Events = [
                        new Event {
                            Name = "Lecture",
                            StartTime = "9.00",
                            EndTime = "10.00",
                            Description = "Lecture about the topic of today"
                            },
                        new Event{
                            Name = "Demo",
                            StartTime = "15.00",
                            EndTime = "16.00",
                            Description = "Presentation of today's topic"
                            }],
                }];

            string[] module_names = { "Hell Week", "API", "React", "Cloud" };
            int[] module_numOfDays = { 5, 3, 2, 3 };
            List<List<Day>> module_days = [hellWeekDays, APIDays, reactDays, cloudDays];

            for (var i = 0; i < module_names.Length; i++)
            {
                Console.WriteLine("Element At i: " + module_days.ElementAt(i).Count());
                var module = new Module
                {
                    Name = module_names[i],
                    NumberOfDays = module_numOfDays[i],
                    Days = module_days.ElementAt(i)
                };
                _context.Modules.Add(module);
                _context.SaveChanges();
            }

            string[] course_names = { "Java S24", "JavaScript S24", "Java W24" };
            int[] course_numOfWeeks = { 2, 3, 2 };

            var moduleDays = _context.Modules.Select(m => m.Days);
            foreach (var days in moduleDays)
                foreach (var day in days)
                    Console.WriteLine(day.Events.Count());

            List<List<int>> course_moduleIds = [[1, 2, 3], [1, 2, 3, 4], [1, 3, 4]];

            for (var i = 0; i < course_names.Length; i++)
            {
                var course = new Course
                {
                    Name = course_names[i],
                    NumberOfWeeks = course_numOfWeeks[i],
                    moduleIds = course_moduleIds[i]
                };
                _context.Courses.Add(course);
                _context.SaveChanges();
            }
        }
    }
}