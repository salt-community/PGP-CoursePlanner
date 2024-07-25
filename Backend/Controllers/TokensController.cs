
using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TokensController : ControllerBase
    {
        private async Task<int> getTokensFromGoogle()
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var url = "https://accounts.google.com/o/oauth2/token";
            var inputJoke = client.GetStreamAsync(url);
            return await JsonSerializer.DeserializeAsync<int>(await inputJoke);
        }
    }
}