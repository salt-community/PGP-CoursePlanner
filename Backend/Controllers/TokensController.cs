using System.Net.Http.Headers;
using System.Web;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;



namespace Backend.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TokensController : ControllerBase
    {
        // private async Task<TokenResponse> GetTokensFromGoogle(string code, string ClientId, string ClientSecret)
        // {
        //     var client =  new HttpClient();

        //     var body = new StringContent(content, Encoding.URI, "application/x-www-form-urlencoded");
        //     body.Headers.ContentType = new MediaTypeHeaderValue("content-type", "application/x-www-form-urlencoded");


        //     var response = client.PostAsync("https://accounts.google.com/o/oauth2/token", );
        //     request.AddParameter("application/x-www-form-urlencoded", "grant_type=authorization_code&client_id={yourClientId}&client_secret=%7ByourClientSecret%7D&code=%7ByourAuthorizationCode%7D&redirect_uri={https://yourApp/callback}", ParameterType.RequestBody);
        //     IRestResponse response = client.Execute(request);
        // }

        private async Task<IActionResult> GetTokensFromGoogle(string Url, string code, string ClientId, string ClientSecret, string redirectUrl)
        {
            using HttpClient client = new();

            var request = new HttpRequestMessage(HttpMethod.Post, Url);


            var parameters = new Dictionary<string, string>
        {

            {"grant_type", "authorization_code"},
            {$"code", code},
            {$"client_id", ClientId},
            {$"client_secret", ClientSecret},
            {$"redirect_uri", redirectUrl}
        };

            var encodedParameters = new FormUrlEncodedContent(parameters);
            var paramText = await encodedParameters.ReadAsStringAsync();

            request.Content = encodedParameters;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");


            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                var errorData = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, errorData);
            }

        }


        [HttpGet("{code}")]
        public async Task<IActionResult> GetTokens(string code)
        {
            var builder = WebApplication.CreateBuilder();
            code = HttpUtility.UrlDecode(code);
            return await GetTokensFromGoogle(
                "https://accounts.google.com/o/oauth2/token",
                code,
                builder.Configuration["AppInfo:ClientId"]!,
                builder.Configuration["AppInfo:ClientSecret"]!,
                "http://localhost:5173");
        }

    }


}

// const response = await fetch(BASE_URL, {
//       method: "POST",
//       headers: {
//         "content-type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "authorization_code",
//         code: auth_code,
//         client_id: import.meta.env.VITE_APP_CLIENT_ID,
//         client_secret: import.meta.env.VITE_APP_CLIENT_SECRET,
//         redirect_uri: "http://localhost:5173",
//       }),
//     });

//     if (!response.ok || response == undefined) {
//       alert("failed get access token");
//       return;
//     }
//     const data = await response.json();
//     return data as tokenResponse;
//   } catch (error) {
//     console.error("Error getting access token", error);
//     alert("Failed to get access token");
//   }