using Backend.Data;
using Backend.Models;

namespace Backend.IntegrationTests
{
    public class Seeding
    {
        public static void InitializeTestDB(DataContext db)
        {
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            db.Courses.AddRange(GetCourses());
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
                new Module(){Name = "TestModule2"}
            };
        }

        private static List<Course> GetCourses()
        {
            var moduleList1 = new List<Module>(){
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
                new Module(){Name = "TestModule2"}
            };

            var moduleList2 = new List<Module>()
            {
                new Module(){Name = "TestModule3",},
                new Module(){Name = "TestModule4", NumberOfDays = 2, Days =
                [
                    new Day(){Description = "TestDay1 for TestModule4", DayNumber = 1, Events =
                    [
                        new Event() { Name = "Event1", StartTime = "10:00", EndTime = "11:00", Description = "TestEvent1 for TestModule4"}
                    ]},
                    new Day() {Description = "TestDay2 for TestModule4", DayNumber = 2}
                ]}
            };

            return new List<Course>()
            {
                new Course(){Name = "TestCourse1", NumberOfWeeks = 2, Modules = moduleList1},
                new Course(){Name = "TestCourse2", NumberOfWeeks = 1, Modules = moduleList2}
            };
        }

    }
}