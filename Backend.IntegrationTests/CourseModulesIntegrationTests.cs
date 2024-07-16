using System.Net;
using System.Net.Http.Headers;
using Backend.Data;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Backend.IntegrationTests
{
    public class CourseModulesIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public CourseModulesIntegrationTests(CustomWebApplicationFactory<Program> factory)
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
        public async Task GetCourseModules_Returns_ListOfCourseModules()
        {
            //  arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<DataContext>();
                Seeding.InitializeTestDB(db);
            }

            // act 
            var response = await _client.GetAsync("/CourseModules");
            var deserializedResponse = JsonConvert.DeserializeObject<List<CourseModule>>(
                await response.Content.ReadAsStringAsync());

            // assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            deserializedResponse.Should().NotBeNull();
            deserializedResponse.Should().HaveCount(2);
        }

    }
}