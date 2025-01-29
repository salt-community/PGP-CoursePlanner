using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Tests.UnitTests
{
    public class ModulesControllerTests
    {
        readonly Mock<IService<Module>> _mockService = new();

        readonly Module module = new()
        {
            Name = "Hell Week",
            NumberOfDays = 10,
            Tracks = new List<Track> { new() { Id = 1, Name = "Java", Color = "#D73A24", Visibility = true } },
            Order = 1,
            StartDate = new DateTime(2024, 7, 12),
        };

        [Fact]
        public async void GetModules_Returns_CollectionOfModules()
        {
            // arrange
            var expectedResponse = new List<ModuleResponse>() { (ModuleResponse)module };

            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync([module]);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.GetModules();

            // assert
            result.Should().BeAssignableTo<IEnumerable<ModuleResponse>>();
            result.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void CreateModule_Returns_CreatedModule()
        {
            // arrange
            var module = new Module() { Name = "TestModule" };
            _mockService.Setup(service => service.CreateAsync(module)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.CreateModule(module);
            var resultValue = (result.Result as CreatedAtActionResult)!.Value as Module;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Module>();
            resultValue!.Name.Should().Be("TestModule");
        }

        [Fact]
        public async void GetModule_Returns_CorrectModule()
        {
            // arrange
            var module = new Module() { Id = 1, Name = "TestModule" };
            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.GetModule(1);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<Module>();
            result.Name.Should().Be("TestModule");
        }

        [Fact]
        public async void GetModule_Returns_NotFound()
        {
            // arrange
            var module = new Module() { Id = 1, Name = "TestModule" };
            _mockService.Setup(service => service.GetOneAsync(2)).ThrowsAsync(new NotFoundByIdException("Module", 2));
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.GetModule(2);
            var resultValue = result;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<NotFoundObjectResult>();
        }

        [Fact]
        public async void UpdateModule_Returns_NoContent()
        {
            // arrange
            var module = new Module() { Id = 1, Name = "TestModule" };
            _mockService.Setup(service => service.UpdateAsync(1, module));
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.UpdateModule(1, module);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void DeleteModule_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.DeleteAsync(1));
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.DeleteModule(1);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }
    }
}