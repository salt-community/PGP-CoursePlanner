using System.Collections.ObjectModel;
using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using Castle.Components.DictionaryAdapter.Xml;
using FluentAssertions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Moq;
using Newtonsoft.Json;

namespace Backend.Tests.IntegrationTests
{

    public class IntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        public IntegrationTests(WebApplicationFactory<Program> fixture) =>
            _client = fixture.CreateClient();

        [Fact]
        public async Task GetModules_Returns_ListOfModules()
        {
            //  arrange
            // var createResponse = await _client.PostAsync("/api/jokes", null);

            // act 
            var getResponse = await _client.GetAsync("/api/Modules");

            var deserializedGetResponse = JsonConvert.DeserializeObject<List<Module>>(
                await getResponse.Content.ReadAsStringAsync());

            // assert
            deserializedGetResponse.Should().NotBeNull();

            // clean up
            //await _client.DeleteAsync(createResponse.Headers.Location.AbsoluteUri);

        }
    }
}