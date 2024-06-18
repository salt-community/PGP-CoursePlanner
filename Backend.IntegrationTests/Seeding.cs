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
            db.SaveChanges();
        }

        private static List<Module> GetModule()
        {

            return new List<Module>()
            {
                new Module(){Name = "TestModule1", NumberOfDays = 3, Days = 
                [
                    new Day(){Description = "Test day 1 for TestModule1", DayNumber = 1, Events = 
                    [
                        new Event() { Name = "Event1", StartTime = "10:00", EndTime = "11:00", Description = "Test event for TestModule1"}
                    ]},
                    new Day(){Description = "Test day 2 for TestModule1", DayNumber = 2, Events = 
                    [
                        new Event() { Name = "Event2", StartTime = "10:00", EndTime = "11:00", Description = "Test 2 event for TestModule1"}
                    ]},
                    new Day() {Description = "Test day 3 for TestModule1", DayNumber = 3}
                ]},
                new Module(){Name = "TestModule2"}
            };
        }

       
    }
}