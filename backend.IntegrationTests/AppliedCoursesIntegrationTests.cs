using System.Net;
using System.Net.Http.Headers;
using System.Text;
using backend.Data;
using backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace backend.IntegrationTests
{
    public class AppliedCoursesIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public AppliedCoursesIntegrationTests(CustomWebApplicationFactory<Program> factory)
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
        public async Task GetAppliedCourses_Returns_ListOfAppliedCourses()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            // act 
            var response = await _client.GetAsync("/AppliedCourses");
            var deserializedResponse = JsonConvert.DeserializeObject<List<Course>>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse.Should().NotBeNull();
            deserializedResponse.Should().HaveCount(1);
        }

        [Fact]
        public async void GetAppliedCourse_Should_Return_OK_AppliedCourse()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            // act
            var response = await _client.GetAsync("/AppliedCourses/1");
            var deserializedResponse = JsonConvert.DeserializeObject<Course>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse!.StartDate.Year.Should().Be(2024);
            deserializedResponse!.Id.Should().Be(1);
        }

        [Fact]
        public async Task CreateAppliedCourse_Returns_Success()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            var newAppliedCourse = new Course() {Name = "JavaScript S24", StartDate = new DateTime(2024-08-06), Id = 2, Color = "#3a0909"};
            var content = JsonConvert.SerializeObject(newAppliedCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act 
            var response = await _client.PostAsync("/AppliedCourses", body);
            var deserializedResponse = JsonConvert.DeserializeObject<Course>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            response.Content.Headers.ContentType.Should().BeOfType<MediaTypeHeaderValue>();
            deserializedResponse!.Id.Should().Be(2);
        }

        [Fact]
        public async Task CreateAppliedCourse_WithWrongId_Returns_NotFound()
        {
            //  arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            var newAppliedCourse = new Course() { StartDate = DateTime.Now, Id = 7 };
            var content = JsonConvert.SerializeObject(newAppliedCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act 
            var response = await _client.PostAsync("/AppliedCourses", body);
            var deserializedResponse = JsonConvert.DeserializeObject<Course>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
            response.Content.Headers.ContentType.Should().BeOfType<MediaTypeHeaderValue>();
        }

    }
}