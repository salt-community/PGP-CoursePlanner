using backend.Controllers;
using backend.Models;
using backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.UnitTests
{
    public class CoursesControllerTests
    {
        readonly Mock<IService<Course>> _mockService = new Mock<IService<Course>>();

        [Fact]
        public async void GetCourses_Returns_Ok()
        {
            // arrange
            var course = new Course() { Name = "TestCourse" };
            _mockService.Setup(service => service.GetAll()).ReturnsAsync(new List<Course>() { course });
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.GetCourses();

            // assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async void GetCourses_Returns_CollectionOfCourses()
        {
            // arrange
            var course = new Course() { Name = "TestCourse" };
            var list = new List<Course>() { course };
            _mockService.Setup(service => service.GetAll()).ReturnsAsync(list);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.GetCourses();
            var resultValue = (result.Result as OkObjectResult)!.Value;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeAssignableTo<IEnumerable<Course>>();
        }

        [Fact]
        public async void CreateCourse_Returns_CreatedCourse()
        {
            // arrange
            var course = new Course() { Name = "TestCourse" };
            _mockService.Setup(service => service.CreateAsync(course)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.CreateCourse(course);
            var resultValue = (result.Result as CreatedAtActionResult)!.Value as Course;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Course>();
            resultValue!.Name.Should().Be("TestCourse");
        }

        // [Fact]
        // public async void CreateCourse_Returns_BadRequest()
        // {
        //     // arrange
        //     var course = new Course() { Name = "TestCourse" };
        //     _mockService.Setup(service => service.CreateAsync(course)).ReturnsAsync((Course)null!);
        //     var controller = new CoursesController(_mockService.Object);

        //     // act
        //     var result = await controller.CreateCourse(course);

        //     // assert
        //     result.Result.Should().NotBeNull();
        //     result.Result.Should().BeOfType<BadRequestObjectResult>();
        // }

        [Fact]
        public async void GetCourse_Returns_CorrectCourse()
        {
            // arrange
            var course = new Course() { Id = 1, Name = "TestCourse" };
            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.GetCourse(1);
            var resultValue = (result.Result as OkObjectResult)!.Value as Course;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<Course>();
            resultValue!.Name.Should().Be("TestCourse");
        }

        // [Fact]
        // public async void GetCourse_Returns_NotFound()
        // {
        //     // arrange
        //     var course = new Course() { Id = 1, Name = "TestCourse" };
        //     _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(course);
        //     var controller = new CoursesController(_mockService.Object);

        //     // act
        //     var result = await controller.GetCourse(2);
        //     var resultValue = result.Result;

        //     // assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<NotFoundObjectResult>();
        // }

        [Fact]
        public async void UpdateCourse_Returns_NoContent()
        {
            // arrange
            var course = new Course() { Id = 1, Name = "TestCourse" };
            _mockService.Setup(service => service.UpdateAsync(1, course)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.UpdateCourse(1, course);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        // [Fact]
        // public async void UpdateCourse_Returns_BadRequest()
        // {
        //     // arrange
        //     var course = new Course() { Id = 1, Name = "TestCourse" };
        //     _mockService.Setup(service => service.UpdateAsync(1, course)).ReturnsAsync((Course)null!);
        //     var controller = new CoursesController(_mockService.Object);

        //     // act
        //     var result = await controller.DeleteCourse(1);

        //     // assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<BadRequestObjectResult>();
        // }

        [Fact]
        public async void DeleteCourse_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(true);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.DeleteCourse(1);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        // [Fact]
        // public async void DeleteCourse_Returns_BadRequest()
        // {
        //     // arrange
        //     _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(false);
        //     var controller = new CoursesController(_mockService.Object);

        //     // act
        //     var result = await controller.DeleteCourse(1);

        //     // assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<BadRequestObjectResult>();
        // }
    }
}