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
                new Module(){Name = "TestModule1", NumberOfDays = 1, Days = 
                [
                    new Day(){Description = "Test day for TestModule1", DayNumber = 1, Events = 
                    [
                        new Event() { Name = "Event1", StartTime = "10:00", EndTime = "11:00", Description = "Test event for TestModule1"}
                    ]}
                ]},
                new Module(){Name = "TestModule2"}
            };
        }

       
    }
}