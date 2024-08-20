

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
    public class CoursesControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public CoursesControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
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
        public async Task GetCourses_Returns_ListOfCourses()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            // act 
            var response = await _client.GetAsync("/Courses");
            var deserializedResponse = JsonConvert.DeserializeObject<List<Course>>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse.Should().NotBeNull();
            deserializedResponse.Should().HaveCount(2);
        }

        [Fact]
        public async void GetCourse_Should_Return_OK_Course()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            // act
            var response = await _client.GetAsync("/Courses/1");
            var deserializedResponse = JsonConvert.DeserializeObject<Course>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse!.Name.Length.Should().NotBe(0);
            deserializedResponse!.Name.Should().Be("TestCourse1");
        }

        [Fact]
        public async Task CreateCourse_Returns_Success()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            var newCourse = new Course() { Name = "CreatedCourse" };
            var content = JsonConvert.SerializeObject(newCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act 
            var response = await _client.PostAsync("/Courses", body);
            var deserializedResponse = JsonConvert.DeserializeObject<Course>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            response.Content.Headers.ContentType.Should().BeOfType<MediaTypeHeaderValue>();
            deserializedResponse!.Name.Should().Be("CreatedCourse");
        }

        [Fact]
        public async Task UpdateCourse_Should_Return_204()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            var updatedCourse = new Course() { Name = "UpdatedCourse", Id = 2 };
            var content = JsonConvert.SerializeObject(updatedCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act
            var response = await _client.PutAsync("/Courses/2", body);

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task UpdateCourse_WithWrongId_Should_Return_404()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            var updatedCourse = new Course() { Name = "UpdatedCourse", Id = 7 };
            var content = JsonConvert.SerializeObject(updatedCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act
            var response = await _client.PutAsync("/Courses/7", body);

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdatedCourse_Should_Have_Correct_Parameters()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            var updatedCourse = new Course()
            {
                Name = "UpdatedCourse",
                Id = 2,
                NumberOfWeeks = 2,
                moduleIds = [3]
            };

            var content = JsonConvert.SerializeObject(updatedCourse);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            await _client.PutAsync("/Courses/2", body);

            // act
            var response = await _client.GetAsync("/Courses/2");
            var deserializedResponse = JsonConvert.DeserializeObject<Course>(
                await response.Content.ReadAsStringAsync());
            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse!.Name.Should().Be("UpdatedCourse");
            deserializedResponse!.NumberOfWeeks.Should().Be(2);
            var modulesIds = deserializedResponse!.moduleIds.ToList();
            modulesIds.Count.Should().Be(1);

            var firstModule = await _client.GetAsync($"/Modules/{modulesIds.First()}");
            var deserializedModule = JsonConvert.DeserializeObject<Module>(
                await firstModule.Content.ReadAsStringAsync());
            deserializedModule!.NumberOfDays.Should().Be(2);
            deserializedModule.Days.First().Description.Should().Be("UpdatedDay1 for UpdatedCourse");
            deserializedModule.Days.First().Events.Count.Should().Be(1);
            deserializedModule.Days.First().Events.First().Name.Should().Be("UpdatedEvent1");
        }

        [Fact]
        public async void DeleteCourse_Should_Return_204()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            // act
            var response = await _client.DeleteAsync("/Courses/1");

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async void GetDeletedCourse_Should_Return_404()
        {
            // arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }
            await _client.DeleteAsync("/Courses/1");

            // act
            var response = await _client.GetAsync("/Courses/1");

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}