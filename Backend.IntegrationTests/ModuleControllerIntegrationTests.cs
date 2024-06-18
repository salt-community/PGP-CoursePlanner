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

                db.Database.EnsureCreated();
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
        public async Task CreateModule_ReturnsSuccess_WithModule()
        {
            //  arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();

                db.Database.EnsureCreated();
            }

            var newModule = new Module(){Name = "CreatedModule"};
            var content = JsonConvert.SerializeObject(newModule);

            var body = new StringContent(content, Encoding.UTF8, "application/json");
            body.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // act 
            var response = await _client.PostAsync("/Modules", body);

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }
    }
}