using backend.Controllers;
using backend.Models;
using backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.UnitTests
{
    public class AppliedCoursesControllerUnitTests
    {
        readonly Mock<IService<AppliedCourse>> _mockService = new Mock<IService<AppliedCourse>>();

        [Fact]
        public async void CreateAppliedCourse_Returns_Ok_AppliedCourse()
        {
            // arrange
            var AppliedCourse = new AppliedCourse() { StartDate = new DateTime(2024 - 07 - 12) };
            _mockService.Setup(service => service.CreateAsync(AppliedCourse)).ReturnsAsync(AppliedCourse);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.CreateAppliedCourse(AppliedCourse);
            var resultValue = (result.Result as CreatedAtActionResult)!.Value as AppliedCourse;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<AppliedCourse>();
            resultValue!.StartDate.Should().Be(new DateTime(2024 - 07 - 12));
        }

        [Fact]
        public async void GetAppliedCourses_Returns_CollectionOfAppliedCourses()
        {
            // arrange
            var AppliedCourse = new AppliedCourse() { StartDate = new DateTime(2024 - 07 - 12) };
            var list = new List<AppliedCourse>() { AppliedCourse };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(list);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.GetAppliedCourses();
            var resultValue = (result.Result as OkObjectResult)!.Value;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<List<AppliedCourse>>();
        }

        // [Fact]
        // public async void CreateAppliedCourse_Returns_BadRequest()
        // {
        //     // arrange
        //     var AppliedCourse = new AppliedCourse() { StartDate = new DateTime(2024 - 07 - 12) };
        //     _mockService.Setup(service => service.CreateAsync(AppliedCourse)).ReturnsAsync((AppliedCourse)null!);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     // act
        //     var result = await controller.CreateAppliedCourse(AppliedCourse);

        //     // assert
        //     result.Result.Should().NotBeNull();
        //     result.Result.Should().BeOfType<BadRequestObjectResult>();
        // }

        [Fact]
        public async void GetAppliedCourse_Returns_CorrectAppliedCourse()
        {
            // arrange
            var AppliedCourse = new AppliedCourse() { Id = 1, StartDate = new DateTime(2024 - 07 - 12) };
            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(AppliedCourse);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.GetAppliedCourse(1);
            var resultValue = (result.Result as OkObjectResult)!.Value as AppliedCourse;

            // assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<AppliedCourse>();
            resultValue!.StartDate.Should().Be(new DateTime(2024 - 07 - 12));
        }

        // [Fact]
        // public async void GetAppliedCourse_Returns_NotFound()
        // {
        //     // arrange
        //     var AppliedCourse = new AppliedCourse() { Id = 1, StartDate = new DateTime(2024-07-12) };
        //     _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(AppliedCourse);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     // act
        //     var result = await controller.GetAppliedCourse(2);
        //     var resultValue = result.Result;

        //     // assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<NotFoundObjectResult>();
        // }


        [Fact]
        public async void DeleteAppliedCourse_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(true);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.DeleteAppliedCourse(1);

            // assert
            result.Should().NotBeNull();
            result.Should().BeOfType<NoContentResult>();
        }

        // [Fact]
        // public async void DeleteAppliedCourse_Returns_BadRequest()
        // {
        //     // arrange
        //     _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(false);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     // act
        //     var result = await controller.DeleteAppliedCourse(1);

        //     // assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<BadRequestObjectResult>();
        // }
    }
}