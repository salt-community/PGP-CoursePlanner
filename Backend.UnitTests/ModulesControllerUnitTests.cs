using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Backend.Tests.UnitTests
{
    public class MockService : IService
    {
        public Task<Module> CreateModuleAsync(Module module)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteModule(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Module>> GetAllModulesAsync()
        {
            var module = new Module() { Name = "Ewy" };
            var list = new List<Module>() { module };
            return list;
        }

        public Task<Module> GetSpecificModule(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Module> UpdateModule(Module module)
        {
            throw new NotImplementedException();
        }
    }
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

        // [Fact]
        // public async void GetModules_Returns_CollectionOfModules()
        // {
        //     //Arrange
        //     var module = new Module() { Name = "Ewy" };
        //     var list = new List<Module>() { module };
        //     _mockService.Setup(service => service.GetAllModulesAsync()).ReturnsAsync(list);
        //     var controller = new ModulesController(_mockService.Object);

        //     //Act
        //     var result = await controller.GetModules();
        //     var resultValue = result.Value;

        //     //Assert
        //     //result.Value.Should().NotBeNull();
        //     resultValue.Should().BeOfType<IEnumerable<Module>>();
        // }

        // [Fact]
        // public async void GetModules_Returns_CollectionOfModules()
        // {
        //     //Arrange
        //     var mock = new MockService();
        //     var controller = new ModulesController(mock);

        //     //Act
        //     var result = await controller.GetModules();
        //     var resultValue = result.Value;

        //     //Assert
        //     //result.Value.Should().NotBeNull();
        //     resultValue.Should().BeOfType<IEnumerable<Module>>();
        // }
    }
}