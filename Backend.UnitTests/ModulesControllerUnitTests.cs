using Backend.Controllers;
using Backend.ExceptionHandler.Exceptions;
using Backend.Models;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Backend.Tests.UnitTests
{
    public class ModulesControllerTests
    {
        readonly Mock<IService<Module>> _mockService = new Mock<IService<Module>>();

        [Fact]
        public async void GetModules_Returns_Ok()
        {
            // arrange
            var module = new Module() { Name = "TestModule" };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(new List<Module>() { module });
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.GetModules();

            // assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async void GetModules_Returns_CollectionOfModules()
        {
            // arrange
            var module = new Module() { Name = "TestModule" };
            var list = new List<Module>() { module };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(list);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.GetModules();
            var resultValue = (result.Result as OkObjectResult)!.Value;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<List<Module>>();
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

        // [Fact]
        // public async void CreateModule_Returns_BadRequest()
        // {
        //     // arrange
        //     var module = new Module() { Name = "TestModule" };
        //     _mockService.Setup(service => service.CreateAsync(module)).ReturnsAsync((Module)null!);
        //     var controller = new ModulesController(_mockService.Object);

        //     // act
        //     var result = await controller.CreateModule(module);

        //     // assert
        //     result.Result.Should().NotBeNull();
        //     result.Result.Should().BeOfType<BadRequestObjectResult>();
        // }

        [Fact]
        public async void GetModule_Returns_CorrectModule()
        {
            // arrange
            var module = new Module() { Id = 1, Name = "TestModule" };
            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.GetModule(1);
            var resultValue = (result.Result as OkObjectResult)!.Value as Module;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Module>();
            resultValue!.Name.Should().Be("TestModule");
        }

        // //TODO: Fix so that it works or remove!!
        // [Fact]
        // public async void GetModule_Returns_NotFound()
        // {
        //     // arrange
        //     var module = new Module() { Id = 1, Name = "TestModule" };
        //     _mockService.Setup(service => service.GetOneAsync(2)).ThrowsAsync(new NotFoundByIdException("Module", 2));
        //     var controller = new ModulesController(_mockService.Object);

        //     // act
        //     var result = await controller.GetModule(2);
        //     var resultValue = result.Result;

        //     // assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<NotFoundObjectResult>();
        // }

        [Fact]
        public async void UpdateModule_Returns_NoContent()
        {
            // arrange
            var module = new Module() { Id = 1, Name = "TestModule" };
            _mockService.Setup(service => service.UpdateAsync(1, module)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.UpdateModule(1, module);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        // [Fact]
        // public async void Updateodule_Returns_BadRequest()
        // {
        //     // arrange
        //     var module = new Module() { Id = 1, Name = "TestModule" };
        //     _mockService.Setup(service => service.UpdateAsync(1, module)).ReturnsAsync((Module)null!);
        //     var controller = new ModulesController(_mockService.Object);

        //     // act
        //     var result = await controller.DeleteModule(1);

        //     // assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<BadRequestObjectResult>();
        // }

        [Fact]
        public async void DeleteModule_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(true);
            var controller = new ModulesController(_mockService.Object);

            // act
            var result = await controller.DeleteModule(1);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        // [Fact]
        // public async void DeleteModule_Returns_BadRequest()
        // {
        //     // arrange
        //     _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(false);
        //     var controller = new ModulesController(_mockService.Object);

        //     // act
        //     var result = await controller.DeleteModule(1);

        //     // assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<BadRequestObjectResult>();
        // }
    }
}