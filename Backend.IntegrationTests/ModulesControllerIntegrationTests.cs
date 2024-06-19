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
    public class ModulesControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public ModulesControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });
        }

        [Fact]
        public async Task GetModules_Returns_ListOfModules()
        {
            //  arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            // act 
            var response = await _client.GetAsync("/Modules");
            var deserializedResponse = JsonConvert.DeserializeObject<List<Module>>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse.Should().NotBeNull();
            deserializedResponse.Should().HaveCount(4);
        }

        [Fact]
        public async void GetModule_Should_Return_OK_Module()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            //act
            var response = await _client.GetAsync("/Modules/1");
            var deserializedResponse = JsonConvert.DeserializeObject<Module>(
                await response.Content.ReadAsStringAsync());

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse!.Name.Length.Should().NotBe(0);
            deserializedResponse!.Name.Should().Be("TestModule1");
        }

        [Fact]
        public async Task CreateModule_Returns_Success()
        {
            //  arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            var newModule = new Module() { Name = "CreatedModule" };
            var content = JsonConvert.SerializeObject(newModule);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act 
            var response = await _client.PostAsync("/Modules", body);
            var deserializedResponse = JsonConvert.DeserializeObject<Module>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            response.Content.Headers.ContentType.Should().BeOfType<MediaTypeHeaderValue>();
            deserializedResponse!.Name.Should().Be("CreatedModule");
        }

        [Fact]
        public async Task UpdateModule_Should_Return_204()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();

                Seeding.InitializeTestDB(db);
            }

            var updatedModule = new Module() { Name = "Updated module!", Id = 2 };
            var content = JsonConvert.SerializeObject(updatedModule);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            //act
            var response = await _client.PutAsync("/Modules/2", body);

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }


        [Fact]
        public async Task UpdatedModule_Should_Have_Correct_Parameters()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();

                Seeding.InitializeTestDB(db);
            }

            var updatedModule = new Module()
            {
                Name = "UpdatedModule",
                Id = 1,
                NumberOfDays = 2,
                Days =
                [
                    new Day(){Description = "Updated test day for TestModule1", DayNumber = 1, Events =
                    [
                        new Event() { Name = "TestEvent1", StartTime = "11:00", EndTime = "12:00", Description = "Updated event for TestModule1"},
                        new Event() { Name = "TestEvent2", StartTime = "22:00", EndTime = "23:00", Description = "Added event for TestModule1"}
                    ]},
                    new Day(){Description = "Updated day 2", DayNumber = 2}
                ]
            };

            var content = JsonConvert.SerializeObject(updatedModule);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            await _client.PutAsync("/Modules/2", body);

            //act
            var response = await _client.GetAsync("/Modules/1");

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var deserializedResponse = JsonConvert.DeserializeObject<Module>(
                await response.Content.ReadAsStringAsync()
            );

            deserializedResponse!.Name.Should().Be("UpdatedModule");
            var days = deserializedResponse.Days.ToList();
            days.Count.Should().Be(2);
            days[1].Events.Count.Should().Be(0);
            days[0].Events.Count.Should().Be(2);
            days[0].Description.Should().Be("Updated test day for TestModule1");
            var eventsOfDayOne = days[0].Events.ToList();
            eventsOfDayOne[0].Description.Should().Be("Updated event for TestModule1");
        }

        [Fact]
        public async void DeleteModule_Should_Return_204()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();

                Seeding.InitializeTestDB(db);
            }

            //act
            var response = await _client.DeleteAsync("/Modules/1");


            //assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async void GetDeletedModule_Should_Return_404()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();

                Seeding.InitializeTestDB(db);
            }
            await _client.DeleteAsync("/Modules/1");

            //act
            var response = await _client.GetAsync("/Modules/1");


            // assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}