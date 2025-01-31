using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Services;

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
}