using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;

namespace backend.UnitTests
{
    public class ModulesControllerUnitTests
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
        public async void GetModules_Returns_CollectionOfModuleResponses()
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
        public async void GetModule_Returns_ModuleResponse()
        {
            // arrange
            var expectedResponse = (ModuleResponse)module;

            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = (await controller.GetModule(1)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<OkObjectResult>();
            value.Should().BeOfType<ModuleResponse>();
            value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void GetModule_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.GetOneAsync(1)).ThrowsAsync(new NotFoundByIdException("Module", 1));
            var controller = new ModulesController(_mockService.Object);

            // act
            var exception = await Record.ExceptionAsync(() => controller.GetModule(1));

            // assert
            exception.Should().BeOfType<NotFoundByIdException>();
            exception.Message.Should().Be("Module with ID 1 was not found.");
        }

        [Fact]
        public async void CreateModule_Returns_CreatedAtAction_With_ModuleResponse()
        {
            // arrange
            var expectedResponse = (ModuleResponse)module;

            _mockService.Setup(service => service.CreateAsync(It.IsAny<Module>())).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = (await controller.CreateModule(module)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<CreatedAtActionResult>();
            value.Should().BeOfType<ModuleResponse>();
            value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void UpdateModule_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.UpdateAsync(1, module));
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.UpdateModule(1, module);

            // assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void UpdateModule_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.UpdateAsync(1, It.IsAny<Module>())).ThrowsAsync(new NotFoundByIdException("Module", 1));
            var controller = new ModulesController(_mockService.Object);

            // act
            var exception = await Record.ExceptionAsync(() => controller.UpdateModule(1, module));

            // assert
            exception.Should().BeOfType<NotFoundByIdException>();
            exception.Message.Should().Be("Module with ID 1 was not found.");
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
            result.Should().BeOfType<NoContentResult>();
        }
    }
}