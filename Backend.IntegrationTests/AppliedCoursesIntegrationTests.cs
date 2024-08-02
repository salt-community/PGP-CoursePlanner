using System.Net;
using System.Net.Http.Headers;
using System.Text;
using Backend.Data;
using Backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Backend.IntegrationTests
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
            var deserializedResponse = JsonConvert.DeserializeObject<List<AppliedCourse>>(
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
            var deserializedResponse = JsonConvert.DeserializeObject<AppliedCourse>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse!.StartDate.Year.Should().Be(2024);
            deserializedResponse!.CourseId.Should().Be(1);
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

            var newAppliedCourse = new AppliedCourse() { StartDate = DateTime.Now, CourseId = 2 };
            var content = JsonConvert.SerializeObject(newAppliedCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act 
            var response = await _client.PostAsync("/AppliedCourses", body);
            var deserializedResponse = JsonConvert.DeserializeObject<AppliedCourse>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            response.Content.Headers.ContentType.Should().BeOfType<MediaTypeHeaderValue>();
            deserializedResponse!.CourseId.Should().Be(2);
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

            var newAppliedCourse = new AppliedCourse() { StartDate = DateTime.Now, CourseId = 7 };
            var content = JsonConvert.SerializeObject(newAppliedCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act 
            var response = await _client.PostAsync("/AppliedCourses", body);
            var deserializedResponse = JsonConvert.DeserializeObject<AppliedCourse>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
            response.Content.Headers.ContentType.Should().BeOfType<MediaTypeHeaderValue>();
        }

    }
}