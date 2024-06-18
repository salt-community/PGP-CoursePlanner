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
    public class ModuleControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public ModuleControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
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
            deserializedResponse.Should().HaveCount(2);

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

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            response.Content.Headers.ContentType.Should().BeOfType<MediaTypeHeaderValue>();

        }

        [Fact]
        public async void GetModule_Should_Return_404()
        {
            //arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();

                Seeding.InitializeTestDB(db);
            }

            //act
            var createResponse = await _client.GetAsync("/Modules/123");

            //assert
            createResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);

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
            var result = await _client.GetAsync("/Modules/1");


            //assert
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var responseBody = JsonConvert.DeserializeObject<Module>(
                await result.Content.ReadAsStringAsync()
            );
            responseBody.Name.Length.Should().NotBe(0);

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
            var result = await _client.DeleteAsync("/Modules/1");


            //assert
            result.StatusCode.Should().Be(HttpStatusCode.NoContent);

        }
    }
}