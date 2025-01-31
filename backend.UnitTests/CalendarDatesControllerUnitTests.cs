using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.UnitTests;

public class CalendarDatesControllerUnitTests
{
    private Mock<IServiceCalendarDates<CalendarDate>> _mockService = new();
    private CalendarDate calendarDate { get; } = new CalendarDate
    {
        Id = 1,
        Date = DateTime.Now,
        DateContent = new List<DateContent>
        {
            new DateContent
            {
                Id = 1,
                Track = new Track { Id = 1, Name = "Java", Color = "#ffffff", Visibility = true },
                CourseName = "Java",
                ModuleName = "Module 1",
                DayOfModule = 1,
                TotalDaysInModule = 1,
                Color = "#ffffff",
                appliedCourseId = 1,
                ModuleId = 1,
                Events = new List<Event>(),
            }
        }
    };

    [Fact]
    public async void GetCalendarDate_Returns_CalendarDate()
    {
        // arrange
        _mockService.Setup(service => service.GetCalendarDate(It.IsAny<DateTime>())).ReturnsAsync(calendarDate);
        var controller = new CalendarDatesController(_mockService.Object);

        // act
        var result = await controller.GetCalendarDate(calendarDate.Date);

        // assert
        result.Should().BeAssignableTo<CalendarDate>();
        result.Should().BeEquivalentTo(calendarDate);
    }

    [Fact]
    public async void GetCalendarDate_Returns_NotFound_With_Message()
    {
        // arrange
        _mockService.Setup(service => service.GetCalendarDate(It.IsAny<DateTime>())).ThrowsAsync(new NotFoundException<CalendarDate>("Content for Calendar Date Not Found"));
        var controller = new CalendarDatesController(_mockService.Object);

        // act
        var exception = await Record.ExceptionAsync(() => controller.GetCalendarDate(calendarDate.Date));

        // assert
        exception.Should().BeAssignableTo<NotFoundException<CalendarDate>>();
        exception.Message.Should().Be("Content for Calendar Date Not Found");
    }

    [Fact]
    public async void GetCalendarDateBatch_Returns_CollectionOfCalendarDates()
    {
        // arrange
        var expectedResponse = new List<CalendarDate>() { calendarDate };

        _mockService.Setup(service => service.GetCalendarDateBatch(It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(expectedResponse);
        var controller = new CalendarDatesController(_mockService.Object);

        // act
        var result = (await controller.GetCalendarDateBatch(new DateTime(), new DateTime().AddDays(31))).Result;
        var value = (result as ObjectResult)!.Value;

        // assert
        result.Should().BeAssignableTo<OkObjectResult>();
        value.Should().BeOfType<List<CalendarDate>>();
        value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async void GetCalendarDateBatch_Returns_BadRequest_With_Message()
    {
        // arrange
        var expectedResponse = new List<CalendarDate>() { calendarDate };

        _mockService.Setup(service => service.GetCalendarDateBatch(It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(expectedResponse);
        var controller = new CalendarDatesController(_mockService.Object);

        // act
        var result = (await controller.GetCalendarDateBatch(new DateTime().AddDays(31), new DateTime())).Result;
        var Message = (result as ObjectResult)!.Value;

        // assert
        result.Should().BeAssignableTo<BadRequestObjectResult>();
        Message.Should().Be("Start date has to be before end date");
    }

    [Fact]
    public async void GetCalendarDate2Weeks_Returns_2WeeksOfCalendarDates()
    {
        // arrange
        var expectedResponse = new List<CalendarDate>() { calendarDate };

        _mockService.Setup(service => service.GetCalendarDate2Weeks(1)).ReturnsAsync(expectedResponse);
        var controller = new CalendarDatesController(_mockService.Object);

        // act
        var result = (await controller.GetCalendarDate2Weeks(1)).Result;
        var value = (result as ObjectResult)!.Value;

        // assert
        result.Should().BeAssignableTo<OkObjectResult>();
        value.Should().BeOfType<List<CalendarDate>>();
        value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async void GetCalendarDate2Weeks_Returns_BadRequest_With_Message()
    {
        // arrange
        var expectedResponse = new List<CalendarDate>() { calendarDate };

        _mockService.Setup(service => service.GetCalendarDate2Weeks(1)).ReturnsAsync(expectedResponse);
        var controller = new CalendarDatesController(_mockService.Object);

        // act
        var result = (await controller.GetCalendarDate2Weeks(54)).Result;
        var Message = (result as ObjectResult)!.Value;

        // assert
        result.Should().BeAssignableTo<BadRequestObjectResult>();
        Message.Should().Be("Week number has to be between 1 and 53");
    }
}