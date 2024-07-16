using System.Net;
using System.Net.Http.Headers;
using Backend.Data;
using Backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Backend.IntegrationTests
{
    public class CalendarDatesIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public CalendarDatesIntegrationTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory
            .CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });

            _client.DefaultRequestHeaders.Authorization =
           new AuthenticationHeaderValue(scheme: "TestScheme");
        }

        [Fact]
        public async void GetCalendarDate_Should_Return_OK_CalendarDate()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            //act
            var response = await _client.GetAsync($"/CalendarDates/{new DateTime(2024, 12, 24)}");
            var deserializedResponse = JsonConvert.DeserializeObject<CalendarDate>(
                await response.Content.ReadAsStringAsync());

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse!.Date.Year.Should().Be(2024);
            deserializedResponse!.Date.Month.Should().Be(12);
            deserializedResponse!.DateContent.Count().Should().Be(1);
            deserializedResponse!.DateContent.First().CourseName.Should().Be("Java");
        }

        [Fact]
        public async void GetNonExistingCalendarDate_Should_Return_NotFound()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            //act
            var response = await _client.GetAsync($"/CalendarDates/{new DateTime(2024, 12, 25)}");
            var deserializedResponse = JsonConvert.DeserializeObject<CalendarDate>(
                await response.Content.ReadAsStringAsync());

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}