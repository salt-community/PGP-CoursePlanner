using backend.Controllers;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Tests.UnitTests
{
    public class AppliedCoursesControllerUnitTests
    {
        readonly Mock<IService<Course>> _mockService = new();

        readonly Course appliedCourse = new()
        {
            Track = new Track() { Id = 1, Name = "Java", Color = "#D73A24", Visibility = true },
            Name = "Java",
            StartDate = new DateTime(2024, 7, 12),
            EndDate = new DateTime(2024, 8, 23),
            NumberOfWeeks = 6,
            Color = "#D73A24",
            IsApplied = true
        };

        [Fact]
        public async void CreateAppliedCourse_Returns_CreatedAtAction_With_CourseResponse()
        {
            // arrange
            var expectedResponse = (CourseResponse)appliedCourse;

            _mockService.Setup(service => service.CreateAsync(appliedCourse)).ReturnsAsync(appliedCourse);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = (await controller.CreateAppliedCourse(appliedCourse)).Result;
            var objectResult = (result as ObjectResult)!;

            // assert
            result.Should().BeOfType<CreatedAtActionResult>();
            objectResult.Value.Should().BeOfType<CourseResponse>();
            objectResult.Value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void GetAppliedCourses_Returns_ListOfCourseResponses()
        {
            // arrange
            var appliedCourseList = new List<Course>() { appliedCourse };
            var expectedResponse = new List<CourseResponse>() { (CourseResponse)appliedCourse };

            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(appliedCourseList);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.GetAppliedCourses();

            // assert
            result.Should().BeOfType<List<CourseResponse>>();
            result.Should().BeEquivalentTo(expectedResponse);
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
        public async void GetAppliedCourse_Returns_CourseResponse()
        {
            // arrange
            var expectedResponse = (CourseResponse)appliedCourse;
            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(appliedCourse);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.GetAppliedCourse(1);

            // assert
            result.Should().BeOfType<CourseResponse>();
            result.Should().BeEquivalentTo(expectedResponse);
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
            _mockService.Setup(service => service.DeleteAsync(1));
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.DeleteAppliedCourse(1);

            // assert
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