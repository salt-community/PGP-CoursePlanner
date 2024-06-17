using System.Collections.ObjectModel;
using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using FluentAssertions;
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

        readonly Mock<ModuleService> _mockService = new Mock<ModuleService>();

        [Fact]
        public async void GetModules_Returns_CollectionOfModules()
        {
            //Arrange
            var controller = new ModulesController(_mockService.Object);
            _mockService.Setup(service => service.GetAllModulesAsync()).ReturnsAsync(new List<Module>());

            //Act
            var result = controller.GetModules();

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<Collection<Module>>();
        }
    }
}