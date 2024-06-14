using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using Moq;

namespace Backend.Tests.UnitTests
{
    public class ModulesControllerTests
    {

        readonly Mock<ModuleService> _mockService = new();

        [Fact]
        public void GetModules_Returns_CollectionOfModules()
        {
            //Arrange
            var controller = new ModulesController(_mockService.Object);
            // _mockService.Setup(service => await service.GetAllModulesAsync().Returns(new List<Module>()))

            //Act

            //Assert

        }
    }
}