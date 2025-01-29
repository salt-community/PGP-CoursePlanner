using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Tests.UnitTests
{
    public class CoursesControllerTests
    {
        readonly Mock<IService<Course>> _mockService = new Mock<IService<Course>>();

        readonly Course course = new()
        {
            Track = new Track() { Id = 1, Name = "Java", Color = "#D73A24", Visibility = true },
            Name = "Java",
            StartDate = new DateTime(2024, 7, 12),
            EndDate = new DateTime(2024, 8, 23),
            NumberOfWeeks = 6,
            Color = "#D73A24",
            IsApplied = false
        };

        [Fact]
        public async void GetCourses_Returns_CollectionOfCourseResponses()
        {
            // arrange
            var courseList = new List<Course>() { course };
            var expectedResponse = new List<CourseResponse>() { (CourseResponse)course };

            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(courseList);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.GetCourses();

            // assert
            result.Should().BeAssignableTo<IEnumerable<CourseResponse>>();
            result.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void GetCourse_Returns_CourseResponse()
        {
            // arrange
            var courseResponse = (CourseResponse)course;

            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = (await controller.GetCourse(1)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<OkObjectResult>();
            value.Should().BeOfType<CourseResponse>();
            value.Should().BeEquivalentTo(courseResponse);
        }

        [Fact]
        public async void GetCourse_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.GetOneAsync(1)).ThrowsAsync(new NotFoundByIdException("Course", 1));
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = (await controller.GetCourse(1)).Result;
            var message = (result as ObjectResult)!.Value as string;

            // assert
            result.Should().BeOfType<NotFoundObjectResult>();
            message.Should().Be("Course with ID 1 was not found.");
        }

        [Fact]
        public async void CreateCourse_Returns_CreatedAtAction_With_CourseResponse()
        {
            // arrange
            var expectedResponse = (CourseResponse)course;

            _mockService.Setup(service => service.CreateAsync(course)).ReturnsAsync(course);
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = (await controller.CreateCourse(course)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<CreatedAtActionResult>();
            value.Should().BeOfType<CourseResponse>();
            value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void UpdateCourse_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.UpdateAsync(1, course));
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.UpdateCourse(1, course);

            // assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void UpdateCourse_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.UpdateAsync(1, course)).ThrowsAsync(new NotFoundByIdException("Course", 1));
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.UpdateCourse(1, course);
            var message = (result as ObjectResult)!.Value as string;

            // assert
            result.Should().BeOfType<NotFoundObjectResult>();
            message.Should().Be("Course with ID 1 was not found.");
        }

        [Fact]
        public async void DeleteCourse_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.DeleteAsync(1));
            var controller = new CoursesController(_mockService.Object);

            // act
            var result = await controller.DeleteCourse(1);

            // assert
            result.Should().BeOfType<NoContentResult>();
        }
    }
}