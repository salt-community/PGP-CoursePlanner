using System.Net.Http.Headers;
using System.Web;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;



namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TokensController : ControllerBase
    {
        private readonly DataContext _context;

        public TokensController(DataContext context)
        {
            _context = context;
        }

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

        private async Task<ActionResult<TokenResponse>> RefreshTokensFromGoogle(string Url, string Refresh_token, string ClientId, string ClientSecret)
        {
            using HttpClient client = new();

            var request = new HttpRequestMessage(HttpMethod.Post, Url);


            var parameters = new Dictionary<string, string>
        {

            {"grant_type", "refresh_token"},
            {$"client_id", ClientId},
            {$"client_secret", ClientSecret},
            {$"refresh_token", Refresh_token}
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

                var loggedInUser = new LoggedInUser() { Refresh_Token = data!.Refresh_token };
                await _context.LoggedInUser.AddAsync(loggedInUser);
                await _context.SaveChangesAsync();
                return new TokenResponse()
                {
                    Access_token = data!.Access_token,
                    Id_token = data.Id_token,
                    Expires_in = data.Expires_in
                };
            }

            return response;

        }

        [HttpGet]
        public async Task<ActionResult<TokenResponse>> RefreshTokens()
        {
            var refreshToken = await _context.LoggedInUser.Select(user => user.Refresh_Token).FirstOrDefaultAsync();
            var builder = WebApplication.CreateBuilder();
            var response = await RefreshTokensFromGoogle(
                "https://accounts.google.com/o/oauth2/token",
                refreshToken,
                builder.Configuration["AppInfo:ClientId"]!,
                builder.Configuration["AppInfo:ClientSecret"]!);

            if (response.Result.GetType() == typeof(OkObjectResult))
            {
                var responseData = (OkObjectResult)response.Result!;
                var data = responseData.Value as TokenResponse;

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