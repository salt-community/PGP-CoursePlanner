using Backend.Data;
using Backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
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
            var getResponse = await _client.GetAsync("/Modules");

            var deserializedGetResponse = JsonConvert.DeserializeObject<List<Module>>(
                await getResponse.Content.ReadAsStringAsync());

            // assert
            deserializedGetResponse.Should().NotBeNull();
            // clean up
            //await _client.DeleteAsync(createResponse.Headers.Location.AbsoluteUri);

        }
    }
}