using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Backend.Tests.UnitTests
{
    public class CoursesControllerTests
    {
        readonly Mock<IService<Course>> _mockService = new Mock<IService<Course>>();

        [Fact]
        public async void GetModules_Returns_Ok()
        {
            //Arrange
            var course = new Course() { Name = "TestCourse" };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(new List<Course>() { course });
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.GetCourses();

            //Assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async void GetModules_Returns_CollectionOfModules()
        {
            //Arrange
            var course = new Course() { Name = "TestCourse" };
            var list = new List<Course>() { course };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(list);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.GetCourses();
            var resultValue = (result.Result as OkObjectResult)!.Value;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<List<Course>>();
        }

        [Fact]
        public async void CreateModule_Returns_CreatedModule()
        {
            //Arrange
            var course = new Course() { Name = "TestCourse" };
            _mockService.Setup(service => service.CreateAsync(course)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.CreateCourse(course);
            var resultValue = (result.Result as CreatedAtActionResult)!.Value as Course;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Course>();
            resultValue!.Name.Should().Be("TestCourse");
        }

        [Fact]
        public async void CreateModule_Returns_BadRequest()
        {
            //Arrange
            var course = new Course() { Name = "TestCourse" };
            _mockService.Setup(service => service.CreateAsync(course)).ReturnsAsync((Course)null!);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.CreateCourse(course);

            //Assert
            result.Result.Should().NotBeNull();
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void GetModule_Returns_CorrectModule()
        {
            //Arrange
            var course = new Course() { Id = 1, Name = "TestCourse" };
            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.GetCourse(1);
            var resultValue = (result.Result as OkObjectResult)!.Value as Course;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Course>();
            resultValue!.Name.Should().Be("TestCourse");
        }

        [Fact]
        public async void GetModule_Returns_NotFound()
        {
            //Arrange
            var course = new Course() { Id = 1, Name = "TestCourse" };
            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.GetCourse(2);
            var resultValue = result.Result;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<NotFoundObjectResult>();
        }

        [Fact]
        public async void UpdateModule_Returns_NoContent()
        {
            //Arrange
            var course = new Course() { Id = 1, Name = "TestCourse" };
            _mockService.Setup(service => service.UpdateAsync(1, course)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.UpdateCourse(1, course);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void Updateodule_Returns_BadRequest()
        {
            //Arrange
            var course = new Course() { Id = 1, Name = "TestCourse" };
            _mockService.Setup(service => service.UpdateAsync(1, course)).ReturnsAsync((Course)null!);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.DeleteCourse(1);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void DeleteModule_Returns_NoContent()
        {
            //Arrange
            _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(true);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.DeleteCourse(1);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void DeleteModule_Returns_BadRequest()
        {
            //Arrange
            _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(false);
            var controller = new CoursesController(_mockService.Object);

            //Act
            var result = await controller.DeleteCourse(1);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<BadRequestObjectResult>();
        }
    }
}