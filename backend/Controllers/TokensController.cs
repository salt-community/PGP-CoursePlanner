using System.Net.Http.Headers;
using System.Web;
using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TokensController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IHttpClientFactory _clientFactory;
        public TokensController(DataContext context, IHttpClientFactory clientFactory)
        {
            _context = context;
            _clientFactory = clientFactory;
        }

        private async Task<ActionResult<TokenResponse>> GetTokensFromGoogle(string Url, string code, string ClientId, string ClientSecret, string redirectUrl)
        {
            var client = _clientFactory.CreateClient();

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

            request.Content = encodedParameters;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var deserializedResponse = JsonConvert.DeserializeObject<TokenResponse>(
                await response.Content.ReadAsStringAsync());
                return Ok(deserializedResponse);
            }

            var errorData = JsonConvert.DeserializeObject<GoogleErrorResponse>
                (await response.Content.ReadAsStringAsync());
            throw new BadRequestInvalidGrantException($"Error: {errorData!.Error} Description: {errorData.Error_Description}");
        }

        private async Task<ActionResult<TokenResponse>> RefreshTokensFromGoogle(string Url, string Refresh_token, string ClientId, string ClientSecret)
        {
            var client = _clientFactory.CreateClient();

            var request = new HttpRequestMessage(HttpMethod.Post, Url);

            var parameters = new Dictionary<string, string>
            {
            {"grant_type", "refresh_token"},
            {$"client_id", ClientId},
            {$"client_secret", ClientSecret},
            {$"refresh_token", Refresh_token}
            };

            var encodedParameters = new FormUrlEncodedContent(parameters);

            request.Content = encodedParameters;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var deserializedResponse = JsonConvert.DeserializeObject<TokenResponse>(
                await response.Content.ReadAsStringAsync());
                return Ok(deserializedResponse);
            }

            var errorData = JsonConvert.DeserializeObject<GoogleErrorResponse>
                (await response.Content.ReadAsStringAsync());
            throw new BadRequestInvalidGrantException($"Error: {errorData!.Error} Description: {errorData.Error_Description}");
        }

        [HttpGet("{code}/{redirectUri}")]
        public async Task<ActionResult<JWTResponse>> GetTokens(string code, string redirectUri)
        {
            var builder = WebApplication.CreateBuilder();
            code = HttpUtility.UrlDecode(code);
            redirectUri = HttpUtility.UrlDecode(redirectUri);

            string client_id;
            if (builder.Configuration["AppInfo:ClientId"] == "Secret")
            {
                client_id = Environment.GetEnvironmentVariable("CLIENT_ID")!;
            }
            else
            {
                client_id = builder.Configuration["AppInfo:ClientId"]!;
            }

            string client_secret;
            if (builder.Configuration["AppInfo:ClientSecret"] == "Secret")
            {
                client_secret = Environment.GetEnvironmentVariable("CLIENT_SECRET")!;
            }
            else
            {
                client_secret = builder.Configuration["AppInfo:ClientSecret"]!;
            }

            var response = await GetTokensFromGoogle(
                "https://accounts.google.com/o/oauth2/token",
                code,
                client_id,
                client_secret,
                redirectUri);

            if (response.Result.GetType() == typeof(OkObjectResult))
            {
                var responseData = (OkObjectResult)response.Result!;
                var data = responseData.Value as TokenResponse;

                var loggedInUser = new LoggedInUser() { Refresh_Token = data!.Refresh_token, Access_Token = data.Access_token, Id_token = data.Id_token };
                _context.LoggedInUser.Add(loggedInUser);
                _context.SaveChanges();
                return new JWTResponse()
                {
                    Access_token = data!.Access_token,
                    Id_token = data.Id_token,
                    Expires_in = data!.Expires_in
                };
            }
            else
            {
                // Convert the response to AccessTokenResponse
                var tokenResponse = response.Result as OkObjectResult;
                var tokenData = tokenResponse.Value as TokenResponse;
                return new JWTResponse()
                {
                    Access_token = tokenData.Access_token,
                    Id_token = tokenData.Id_token,
                    Expires_in = tokenData.Expires_in
                };
            }
        }

        [HttpPut]
        public async Task<ActionResult<JWTResponse>> RefreshTokens([FromBody] string access_token)
        {
            if (string.IsNullOrEmpty(access_token))
            {
                return BadRequest("access_token is required");
            }

            // Get the user based on the provided id_token
            var user = await _context.LoggedInUser
                .FirstOrDefaultAsync(u => u.Access_Token == access_token);

            Console.WriteLine(user);
            Console.WriteLine("Look here");

            if (user == null)
            {
                return NotFound("User not found for the provided access_token");
            }

            // Get the refresh token associated with the user
            var refreshToken = user.Refresh_Token;
            if (string.IsNullOrEmpty(refreshToken))
            {
                return NotFound("No refresh token found for this user");
            }

            var builder = WebApplication.CreateBuilder();
            string client_id = builder.Configuration["AppInfo:ClientId"] == "Secret" 
                ? Environment.GetEnvironmentVariable("CLIENT_ID")! 
                : builder.Configuration["AppInfo:ClientId"]!;
            
            string client_secret = builder.Configuration["AppInfo:ClientSecret"] == "Secret" 
                ? Environment.GetEnvironmentVariable("CLIENT_SECRET")! 
                : builder.Configuration["AppInfo:ClientSecret"]!;
            
            var response = await RefreshTokensFromGoogle(
                "https://accounts.google.com/o/oauth2/token", 
                refreshToken, 
                client_id, 
                client_secret);

            if (response.Result is OkObjectResult responseData)
            {
                var data = responseData.Value as TokenResponse;

                // Update the user's tokens in the database
                user.Access_Token = data!.Access_token;
                user.Id_token = data.Id_token;

                // Save the changes to the database
                _context.LoggedInUser.Update(user);
                await _context.SaveChangesAsync();

                // Return the new tokens in the response
                return new JWTResponse()
                {
                    Access_token = data.Access_token,
                    Id_token = data.Id_token,
                    Expires_in = data.Expires_in
                };
            }

            return StatusCode(500, "Error refreshing tokens");
        }



        [HttpDelete]
        public async Task<IActionResult> DeleteRefreshTokens()
        {
            await _context.LoggedInUser.ForEachAsync(user => _context.LoggedInUser.Remove(user));
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }


}