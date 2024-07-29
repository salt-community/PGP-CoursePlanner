using System.Net.Http.Headers;
using System.Web;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;



namespace Backend.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TokensController : ControllerBase
    {
        private readonly DataContext _context;

        public TokensController(DataContext context)
        {
            _context = context;
        }

        // private async Task<TokenResponse> GetTokensFromGoogle(string code, string ClientId, string ClientSecret)
        // {
        //     var client =  new HttpClient();

        //     var body = new StringContent(content, Encoding.URI, "application/x-www-form-urlencoded");
        //     body.Headers.ContentType = new MediaTypeHeaderValue("content-type", "application/x-www-form-urlencoded");


        //     var response = client.PostAsync("https://accounts.google.com/o/oauth2/token", );
        //     request.AddParameter("application/x-www-form-urlencoded", "grant_type=authorization_code&client_id={yourClientId}&client_secret=%7ByourClientSecret%7D&code=%7ByourAuthorizationCode%7D&redirect_uri={https://yourApp/callback}", ParameterType.RequestBody);
        //     IRestResponse response = client.Execute(request);
        // }

        private async Task<ActionResult<TokenResponse>> GetTokensFromGoogle(string Url, string code, string ClientId, string ClientSecret, string redirectUrl)
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
                var deserializedResponse = JsonConvert.DeserializeObject<TokenResponse>(
                await response.Content.ReadAsStringAsync());
                return Ok(deserializedResponse);
            }
            else
            {
                var errorData = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, errorData);
            }

        }

        private async Task<ActionResult<TokenResponse>> RefreshTokensFromGoogle(string Url, string Refresh_token, string ClientId, string ClientSecret, string RefreshToken)
        {
            using HttpClient client = new();

            var request = new HttpRequestMessage(HttpMethod.Post, Url);


            var parameters = new Dictionary<string, string>
        {

            {"grant_type", "refresh_token"},
            {$"client_id", ClientId},
            {$"client_secret", ClientSecret},
            {$"refresh_token", RefreshToken}
        };

            var encodedParameters = new FormUrlEncodedContent(parameters);
            var paramText = await encodedParameters.ReadAsStringAsync();

            request.Content = encodedParameters;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");


            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var deserializedResponse = JsonConvert.DeserializeObject<TokenResponse>(
                await response.Content.ReadAsStringAsync());
                return Ok(deserializedResponse);
            }
            else
            {
                var errorData = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, errorData);
            }

        }


        [HttpGet("{code}")]
        public async Task<ActionResult<TokenResponse>> GetTokens(string code)
        {
            var builder = WebApplication.CreateBuilder();
            code = HttpUtility.UrlDecode(code);
            var response = await GetTokensFromGoogle(
                "https://accounts.google.com/o/oauth2/token",
                code,
                builder.Configuration["AppInfo:ClientId"]!,
                builder.Configuration["AppInfo:ClientSecret"]!,
                "http://localhost:5173");

            if (response.Result.GetType() == typeof(OkObjectResult))
            {
                var responseData = (OkObjectResult)response.Result!;
                var data = responseData.Value as TokenResponse;

                var loggedInUser = new LoggedInUser(){Refresh_Token = data!.Refresh_token};
                await _context.LoggedInUser.AddAsync(loggedInUser);
                return new TokenResponse()
                {
                    Access_token = data!.Access_token,
                    Id_token = data.Id_token,
                    Expires_in = data.Expires_in
                };
            }

            return response;

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