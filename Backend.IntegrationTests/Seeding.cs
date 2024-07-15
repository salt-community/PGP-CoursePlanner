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
            db.Modules.AddRange(GetModule());
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

            // var courseModuleList1 = new List<CourseModule>(){
            //     new CourseModule(){CourseId = 1, ModuleId = 1},
            //     new CourseModule(){CourseId = 1, ModuleId = 2}
            // };

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

            // var courseModuleList2 = new List<CourseModule>(){
            //     new CourseModule(){CourseId = 2, ModuleId = 3},
            //     new CourseModule(){CourseId = 2, ModuleId = 4}
            // };

            return new List<Course>()
            {
                new Course(){Name = "TestCourse1", NumberOfWeeks = 2},
                new Course(){Name = "TestCourse2", NumberOfWeeks = 1}
            };
        }

    }
}