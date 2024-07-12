using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Backend.Tests.UnitTests
{
    public class AppliedCoursesControllerUnitTests
    {
        readonly Mock<IService<AppliedCourse>> _mockService = new Mock<IService<AppliedCourse>>();

        [Fact]
        public async void CreateAppliedCourse_Returns_Ok_AppliedCourse()
        {
            //Arrange
            var AppliedCourse = new AppliedCourse() { StartDate = new DateTime(2024-07-12) };
            _mockService.Setup(service => service.CreateAsync(AppliedCourse)).ReturnsAsync(AppliedCourse);
            var controller = new AppliedCoursesController(_mockService.Object);

            //Act
            var result = await controller.CreateAppliedCourse(AppliedCourse);
            var resultValue = (result.Result as CreatedAtActionResult)!.Value as AppliedCourse;

            //Assert
            resultValue.Should().NotBeNull();
            resultValue.Should().BeOfType<AppliedCourse>();
            resultValue!.StartDate.Should().Be(new DateTime(2024-07-12));
        }

        // [Fact]
        // public async void GetAppliedCourses_Returns_CollectionOfAppliedCourses()
        // {
        //     //Arrange
        //     var AppliedCourse = new AppliedCourse() { Name = "TestAppliedCourse" };
        //     var list = new List<AppliedCourse>() { AppliedCourse };
        //     _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(list);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.GetAppliedCourses();
        //     var resultValue = (result.Result as OkObjectResult)!.Value;

        //     //Assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<List<AppliedCourse>>();
        // }

        // [Fact]
        // public async void CreateAppliedCourse_Returns_CreatedAppliedCourse()
        // {
        //     //Arrange
        //     var AppliedCourse = new AppliedCourse() { Name = "TestAppliedCourse" };
        //     _mockService.Setup(service => service.CreateAsync(AppliedCourse)).ReturnsAsync(AppliedCourse);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.CreateAppliedCourse(AppliedCourse);
        //     var resultValue = (result.Result as CreatedAtActionResult)!.Value as AppliedCourse;

        //     //Assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<AppliedCourse>();
        //     resultValue.Name.Should().Be("TestAppliedCourse");
        // }

        // [Fact]
        // public async void CreateAppliedCourse_Returns_BadRequest()
        // {
        //     //Arrange
        //     var AppliedCourse = new AppliedCourse() { Name = "TestAppliedCourse" };
        //     _mockService.Setup(service => service.CreateAsync(AppliedCourse)).ReturnsAsync((AppliedCourse)null);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.CreateAppliedCourse(AppliedCourse);

        //     //Assert
        //     result.Result.Should().NotBeNull();
        //     result.Result.Should().BeOfType<BadRequestObjectResult>();
        // }

        // [Fact]
        // public async void GetAppliedCourse_Returns_CorrectAppliedCourse()
        // {
        //     //Arrange
        //     var AppliedCourse = new AppliedCourse() { Id = 1, Name = "TestAppliedCourse" };
        //     _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(AppliedCourse);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.GetAppliedCourse(1);
        //     var resultValue = (result.Result as OkObjectResult)!.Value as AppliedCourse;

        //     //Assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<AppliedCourse>();
        //     resultValue.Name.Should().Be("TestAppliedCourse");
        // }

        // [Fact]
        // public async void GetAppliedCourse_Returns_NotFound()
        // {
        //     //Arrange
        //     var AppliedCourse = new AppliedCourse() { Id = 1, Name = "TestAppliedCourse" };
        //     _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(AppliedCourse);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.GetAppliedCourse(2);
        //     var resultValue = result.Result;

        //     //Assert
        //     resultValue.Should().NotBeNull();
        //     resultValue.Should().BeOfType<NotFoundObjectResult>();
        // }

        // [Fact]
        // public async void UpdateAppliedCourse_Returns_NoContent()
        // {
        //     //Arrange
        //     var AppliedCourse = new AppliedCourse() { Id = 1, Name = "TestAppliedCourse" };
        //     _mockService.Setup(service => service.UpdateAsync(1, AppliedCourse)).ReturnsAsync(AppliedCourse);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.UpdateAppliedCourse(1, AppliedCourse);

        //     //Assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<NoContentResult>();
        // }

        // [Fact]
        // public async void Updateodule_Returns_BadRequest()
        // {
        //     //Arrange
        //     var AppliedCourse = new AppliedCourse() { Id = 1, Name = "TestAppliedCourse" };
        //     _mockService.Setup(service => service.UpdateAsync(1, AppliedCourse)).ReturnsAsync((AppliedCourse)null);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.DeleteAppliedCourse(1);

        //     //Assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<BadRequestObjectResult>();
        // }

        // [Fact]
        // public async void DeleteAppliedCourse_Returns_NoContent()
        // {
        //     //Arrange
        //     _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(true);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.DeleteAppliedCourse(1);

        //     //Assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<NoContentResult>();
        // }

        // [Fact]
        // public async void DeleteAppliedCourse_Returns_BadRequest()
        // {
        //     //Arrange
        //     _mockService.Setup(service => service.DeleteAsync(1)).ReturnsAsync(false);
        //     var controller = new AppliedCoursesController(_mockService.Object);

        //     //Act
        //     var result = await controller.DeleteAppliedCourse(1);

        //     //Assert
        //     result.Should().NotBeNull();
        //     result.Should().BeOfType<BadRequestObjectResult>();
        // }
    }
}