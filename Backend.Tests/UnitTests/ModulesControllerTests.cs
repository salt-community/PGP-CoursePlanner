using System.Collections.ObjectModel;
using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using Castle.Components.DictionaryAdapter.Xml;
using FluentAssertions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Backend.Tests.UnitTests
{
    public class ModulesControllerTests
    {
        // Mock<ISaltJokeClient> clientMoq = new Mock<ISaltJokeClient>();
        // Mock<IJokeRepository> repoMoq = new Mock<IJokeRepository>();

        // [Fact]
        // public void JokesController_GetJoke_ShouldReturn_JokeResponse()
        // {
        //     // Arrange
        //     repoMoq.Setup(p => p.GetJoke("1")).Returns(new Joke("It's Funny"));
        //     var controller = new JokesController(repoMoq.Object, clientMoq.Object);

        //     // Act 
        //     var result = controller.GetJoke("1");

        //     // Assert
        //     result.Should().NotBeNull();
        //     var joke = result.Value.Joke;
        //     joke.Should().Be("It's Funny");
        // }

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
            var resultValue = result.Value;

            //Assert
            //result.Value.Should().NotBeNull();
            resultValue.Should().BeOfType<IEnumerable<Module>>();
        }
    }
}