using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var _context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
        {
            _context.Database.EnsureDeleted();
            _context.Database.Migrate();
            _context.Database.EnsureCreated();

            SeedTracks(_context);
            SeedModules(_context);
            SeedCourses(_context);
        }
    }

    private static void SeedTracks(DataContext _context)
    {
        var tracks = TracksList();

        foreach (var track in tracks)
        {
            _context.Tracks.Add(track);
            _context.SaveChanges();
        }
    }

    private static List<Track> TracksList()
    {
        List<Track> tracks = [
            new Track { Name = "Java", Color = "#D73A24", Visibility = true },
            new Track { Name = "Javascript", Color = "#F7DF1E", Visibility = true },
            new Track { Name = ".NET", Color = "#512BD4", Visibility = true }
        ];

        return tracks;
    }

    private static void SeedModules(DataContext _context)
    {
        var tracks = _context.Tracks.ToList();
        var days = ModuleDaysList();

        string[] moduleNames = ["Hell Week", "API", "React", "Cloud"];

        for (var i = 0; i < moduleNames.Length; i++)
        {
            List<List<int>> moduleTrackIds = [[1, 2, 3], [1], [1, 2], [3]];

            var module = new Module
            {
                Name = moduleNames[i],
                NumberOfDays = days[i].Count,
                Days = days[i],
                Tracks = tracks.Where(t => moduleTrackIds[i].Contains(t.Id)).ToList()
            };
            _context.Modules.Add(module);
            _context.SaveChanges();
        }
    }

    private static List<List<Day>> ModuleDaysList()
    {
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

        return [hellWeekDays, APIDays, reactDays, cloudDays];
    }

    private static void SeedCourses(DataContext _context)
    {
        var tracks = _context.Tracks.ToList();
        var modules = _context.Modules.ToList();

        string[] courseNames = { "Java", "JavaScript", "Dotnet" };
        int[] courseNumOfWeeks = { 2, 3, 2 };

        List<List<int>> courseModuleIds = [[1, 2, 3], [1, 2, 3, 4], [1, 3, 4]];

        for (var i = 0; i < courseNames.Length; i++)
        {
            var courseModules = new List<CourseModule>();
            for (int j = 0; j < courseModuleIds[i].Count; j++)
            {
                var courseModuleElement = new CourseModule
                {
                    ModuleId = courseModuleIds[i][j],
                    Module = modules.First(m => m.Id == courseModuleIds[i][j])
                };
                courseModules.Add(courseModuleElement);
            }

            var course = new Course
            {
                Name = courseNames[i],
                NumberOfWeeks = courseNumOfWeeks[i],
                moduleIds = courseModuleIds[i],
                Modules = courseModules,
                IsApplied = false,
                Track = tracks[i]
            };

            _context.Courses.Add(course);
            _context.SaveChanges();
        }
    }
}