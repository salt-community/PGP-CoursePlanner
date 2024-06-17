using Backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;

namespace Backend.IntegrationTests
{
   public class ModuleControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        public ModuleControllerIntegrationTests(WebApplicationFactory<Program> fixture) =>
            _client = fixture.CreateClient();

        [Fact]
        public async Task GetModules_Returns_ListOfModules()
        {
            //  arrange
            // var createResponse = await _client.PostAsync("/api/jokes", null);

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