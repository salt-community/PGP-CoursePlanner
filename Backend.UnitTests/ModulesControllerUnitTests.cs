using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Backend.Tests.UnitTests
{
    public class ModulesControllerTests
    {
        readonly Mock<IService> _mockService = new Mock<IService>();

        [Fact]
        public async void GetModules_Returns_Ok()
        {
            //Arrange
            var module = new Module() { Name = "Ewy" };
            _mockService.Setup(service => service.GetAllModulesAsync()).ReturnsAsync(new List<Module>() { module });
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.GetModules();

            //Assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async void GetModules_Returns_CollectionOfModules()
        {
            //Arrange
            var module = new Module() { Name = "Ewy" };
            var list = new List<Module>() { module };
            _mockService.Setup(service => service.GetAllModulesAsync()).ReturnsAsync(list);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.GetModules();
            var resultValue = (result.Result as OkObjectResult)!.Value;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<List<Module>>();
        }

        [Fact]
        public async void CreateModule_Returns_CreatedModule()
        {
            //Arrange
            var module = new Module() { Name = "Ewy" };
            _mockService.Setup(service => service.CreateModuleAsync(module)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.CreateModule(module);
            var resultValue = (result.Result as CreatedAtActionResult)!.Value as Module;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Module>();
            resultValue.Name.Should().Be("Ewy");
        }

        [Fact]
        public async void GetModule_Returns_CorrectModule()
        {
            //Arrange
            var module = new Module() { Id = 1, Name = "Ewy" };
            _mockService.Setup(service => service.GetSpecificModule(1)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.GetModule(1);
            var resultValue = (result.Result as OkObjectResult)!.Value as Module;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Module>();
            resultValue.Name.Should().Be("Ewy");
        }

        [Fact]
        public async void GetModule_Returns_Badrequest()
        {
            //Arrange
            var module = new Module() { Id = 1, Name = "Ewy" };
            _mockService.Setup(service => service.GetSpecificModule(1)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.GetModule(2);
            var resultValue = result.Result;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void UpdateModule_Returns_NoContent()
        {
            //Arrange
            var module = new Module() { Id = 1, Name = "Ewy" };
            _mockService.Setup(service => service.UpdateModule(module)).ReturnsAsync(module);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.UpdateModule(1, module);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void Updateodule_Returns_BadRequest()
        {
            //Arrange
            var module = new Module() { Id = 1, Name = "Ewy" };
            _mockService.Setup(service => service.UpdateModule(module)).ReturnsAsync((Module)null);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.DeleteModule(1);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void DeleteModule_Returns_NoContent()
        {
            //Arrange
            _mockService.Setup(service => service.DeleteModule(1)).ReturnsAsync(true);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.DeleteModule(1);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void DeleteModule_Returns_BadRequest()
        {
            //Arrange
            _mockService.Setup(service => service.DeleteModule(1)).ReturnsAsync(false);
            var controller = new ModulesController(_mockService.Object);

            //Act
            var result = await controller.DeleteModule(1);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<BadRequestObjectResult>();
        }



        // public class MockService : IService
        // {
        //     public Task<Module> CreateModuleAsync(Module module)
        //     {
        //         throw new NotImplementedException();
        //     }

        //     public Task<bool> DeleteModule(int id)
        //     {
        //         throw new NotImplementedException();
        //     }

        //     public async Task<List<Module>> GetAllModulesAsync()
        //     {
        //         Console.WriteLine("!!!!!In mock service");
        //         var module = new Module() { Name = "Ewy" };
        //         var list = new List<Module>() { module };
        //         return list;
        //     }

        //     public Task<Module> GetSpecificModule(int id)
        //     {
        //         throw new NotImplementedException();
        //     }

        //     public Task<Module> UpdateModule(Module module)
        //     {
        //         throw new NotImplementedException();
        //     }
        // }

        // [Fact]
        // public async void GetModules_Returns_CollectionOfModules()
        // {
        //     //Arrange
        //     var mock = new MockService();
        //     var controller = new ModulesController(mock);

        //     //Act
        //     var result = await controller.GetModules();
        //     var resultValue = (result.Result as OkObjectResult).Value;

        //     //Assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<List<Module>>();
        // }
    }
}