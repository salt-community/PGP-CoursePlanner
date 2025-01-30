using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Tests.UnitTests
{
    public class TracksControllerTests
    {
        readonly Mock<IService<Track>> _mockService = new();

        readonly Track track = new() { Id = 1, Name = "Java", Color = "#D73A24", Visibility = true };
        readonly TrackRequest trackRequest = new() { Name = "Java", Color = "#D73A24" };

        [Fact]
        public async void GetTracks_Returns_CollectionOfTrackResponses()
        {
            // arrange
            var expectedResponse = new List<TrackResponse>() { (TrackResponse)track };

            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync([track]);
            var controller = new TracksController(_mockService.Object);

            // act
            var result = await controller.GetTracks();

            // assert
            result.Should().BeAssignableTo<IEnumerable<TrackResponse>>();
            result.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void GetTrack_Returns_TrackResponse()
        {
            // arrange
            var expectedResponse = (TrackResponse)track;

            _mockService.Setup(service => service.GetOneAsync(1)).ReturnsAsync(track);
            var controller = new TracksController(_mockService.Object);

            // act
            var result = (await controller.GetTrack(1)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<OkObjectResult>();
            value.Should().BeOfType<TrackResponse>();
            value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void GetTrack_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.GetOneAsync(1)).ThrowsAsync(new NotFoundByIdException("Track", 1));
            var controller = new TracksController(_mockService.Object);

            // act
            var exception = await Record.ExceptionAsync(() => controller.GetTrack(1));

            // assert
            exception.Should().BeOfType<NotFoundByIdException>();
            exception.Message.Should().Be("Track with ID 1 was not found.");
        }

        [Fact]
        public async void CreateTrack_Returns_CreatedAtAction_With_TrackResponse()
        {
            // arrange
            var expectedResponse = (TrackResponse)track;

            _mockService.Setup(service => service.CreateAsync(It.IsAny<Track>())).ReturnsAsync(track);
            var controller = new TracksController(_mockService.Object);

            // act
            var result = (await controller.CreateTrack(trackRequest)).Result;
            var value = (result as ObjectResult)!.Value;

            // assert
            result.Should().BeOfType<CreatedAtActionResult>();
            value.Should().BeOfType<TrackResponse>();
            value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async void UpdateTrack_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.UpdateAsync(1, track));
            var controller = new TracksController(_mockService.Object);

            // act
            var result = await controller.UpdateTrack(1, trackRequest);

            // assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async void UpdateTrack_Returns_NotFound_With_Message()
        {
            // arrange
            _mockService.Setup(service => service.UpdateAsync(1, It.IsAny<Track>())).ThrowsAsync(new NotFoundByIdException("Track", 1));
            var controller = new TracksController(_mockService.Object);

            // act
            var exception = await Record.ExceptionAsync(() => controller.UpdateTrack(1, trackRequest));

            // assert
            exception.Should().BeOfType<NotFoundByIdException>();
            exception.Message.Should().Be("Track with ID 1 was not found.");
        }

        [Fact]
        public async void DeleteTrack_Returns_NoContent()
        {
            // arrange
            _mockService.Setup(service => service.DeleteAsync(1));
            var controller = new TracksController(_mockService.Object);

            // act
            var result = await controller.DeleteTrack(1);

            // assert
            result.Should().BeOfType<NoContentResult>();
        }
    }
}