using backend.Data;
using backend.Models;

namespace backend.IntegrationTests
{
    public class Seeding
    {
        public static void InitializeTestDB(DataContext db)
        {
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            db.Modules.AddRange(GetModule());
            db.Courses.AddRange(GetCourses());
            db.Courses.AddRange(GetAppliedCourses());
            db.CalendarDates.AddRange(GetCalendarDates());
            db.SaveChanges();
        }

        private static List<Module> GetModule()
        {

            return new List<Module>()
            {
                new Module(){Name = "TestModule1", NumberOfDays = 3, Days =
                [
                    new Day(){Description = "TestDay1 for TestModule1", DayNumber = 1, Events =
                    [
                        new Event() { Name = "Event1", StartTime = "10:00", EndTime = "11:00", Description = "TestEvent1 for TestModule1"}
                    ]},
                    new Day(){Description = "TestDay2 for TestModule1", DayNumber = 2, Events =
                    [
                        new Event() { Name = "Event2", StartTime = "10:00", EndTime = "11:00", Description = "TestEvent2 for TestModule1"}
                    ]},
                    new Day() {Description = "TestDay3 for TestModule1", DayNumber = 3}
                ]},
                new Module(){Name = "TestModule2"},

                new Module(){Name = "UpdatedModule1", NumberOfDays = 2, Days =
                [
                    new Day(){Description = "UpdatedDay1 for UpdatedCourse", DayNumber = 1, Events =
                    [
                        new Event() { Name = "UpdatedEvent1", StartTime = "10:00", EndTime = "11:00", Description = "UpdatedEvent1 for UpdatedCourse"}
                    ]},
                    new Day() {Description = "UpdatedDay2 for UpdatedCourse", DayNumber = 2}
                ]}
            };
        }

        private static List<Course> GetCourses()
        {
            return new List<Course>()
            {
                new Course(){Name = "TestCourse1", NumberOfWeeks = 2, moduleIds = [1,2]},
                new Course(){Name = "TestCourse2", NumberOfWeeks = 1, moduleIds = [1]}
            };
        }

        private static List<Course> GetAppliedCourses()
        {
            return new List<Course>()
            {
                new Course(){StartDate = new DateTime(2024, 1, 13).ToUniversalTime(), IsApplied = true}
            };
        }

        private static List<CalendarDate> GetCalendarDates()
        {
            return new List<CalendarDate>()
            {
                new CalendarDate(){Date = new DateTime(2024, 12, 24, 0, 0, 0, DateTimeKind.Utc), 
                DateContent = new List<DateContent>()
                {
                    new DateContent(){CourseName = "Java"}
                }}
            };
        }

    }
}