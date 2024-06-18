using Backend.Data;
using Backend.Models;

namespace Backend.IntegrationTests
{
    public class Seeding
    {
        public static void InitializeTestDB(DataContext db)
        {
            db.Modules.AddRange(GetModule());
            db.SaveChanges();
        }
        
        private static List<Module> GetModule()
        {
            return new List<Module>()
            {
                new Module(){Name = "TestModule1"},
                new Module(){Name = "TestModule2"}
            };
        }
    }
}