using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
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
        public async void GetAppliedCourses_Returns_CollectionOfCourseResponses()
        {
            // arrange
            var expectedResponse = new List<CourseResponse>() { (CourseResponse)appliedCourse };

            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync([appliedCourse]);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.GetAppliedCourses();

            // assert
            result.Should().BeAssignableTo<IEnumerable<CourseResponse>>();
            result.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void GetAppliedCourse_Returns_CourseResponse()
        {
            // arrange
            var expectedResponse = (CourseResponse)appliedCourse;

            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(appliedCourse);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = (await controller.GetAppliedCourse(1)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<OkObjectResult>();
            value.Should().BeOfType<CourseResponse>();
            value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void GetAppliedCourse_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.GetOneAsync(1)).ThrowsAsync(new NotFoundByIdException("Course", 1));
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var exception = await Record.ExceptionAsync(() => controller.GetAppliedCourse(1));

            // assert
            exception.Should().BeOfType<NotFoundByIdException>();
            exception.Message.Should().Be("Course with ID 1 was not found.");
        }

        [Fact]
        public async void CreateAppliedCourse_Returns_CreatedAtAction_With_CourseResponse()
        {
            // arrange
            var expectedResponse = (CourseResponse)appliedCourse;

            _mockService.Setup(service => service.CreateAsync(appliedCourse)).ReturnsAsync(appliedCourse);
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = (await controller.CreateAppliedCourse(appliedCourse)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<CreatedAtActionResult>();
            value.Should().BeOfType<CourseResponse>();
            value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void UpdateAppliedCourse_Returns_NoContent()
        {
            //arrange
            _mockService.Setup(service => service.UpdateAsync(1, appliedCourse));
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var result = await controller.UpdateAppliedCourse(1, appliedCourse);

            // assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void UpdateAppliedCourse_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.UpdateAsync(1, It.IsAny<Course>())).ThrowsAsync(new NotFoundByIdException("Course", 1));
            var controller = new AppliedCoursesController(_mockService.Object);

            // act
            var exception = await Record.ExceptionAsync(() => controller.UpdateAppliedCourse(1, appliedCourse));

            // assert
            exception.Should().BeOfType<NotFoundByIdException>();
            exception.Message.Should().Be("Course with ID 1 was not found.");
        }

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
    }
}