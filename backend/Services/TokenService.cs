using System.Net.Http.Headers;
using System.Web;
using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace backend.Services;

public class TokenService(DataContext context, IHttpClientFactory clientFactory) : IServiceTokens<TokenResponse>
{
    private readonly DataContext _context = context;
    private readonly IHttpClientFactory _clientFactory = clientFactory;
    private static Dictionary<string, string>? _environmentVariables;

    public async Task<TokenResponse> GetTokensFromGoogle(string? auth_code, string? redirectUrl, string? refresh_token)
    {
        var (ClientId, ClientSecret) = GetEnvironmentVariables();

        var parameters = new Dictionary<string, string>();
        if (refresh_token != null)
        {
            parameters = new Dictionary<string, string>
            {
                {"grant_type", "refresh_token"},
                {$"client_id", ClientId},
                {$"client_secret", ClientSecret},
                {$"refresh_token", refresh_token}
            };
        }
        else if (auth_code != null && redirectUrl != null)
        {
            auth_code = HttpUtility.UrlDecode(auth_code);
            redirectUrl = HttpUtility.UrlDecode(redirectUrl);
            parameters = new Dictionary<string, string>
            {
                {"grant_type", "authorization_code"},
                {$"code", auth_code},
                {$"client_id", ClientId},
                {$"client_secret", ClientSecret},
                {$"redirect_uri", redirectUrl}
            };
        }

        var encodedParameters = new FormUrlEncodedContent(parameters);

        var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.google.com/o/oauth2/token");
        request.Content = encodedParameters;
        request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);

        if (response.IsSuccessStatusCode)
        {
            var deserializedTokenResponse = JsonConvert.DeserializeObject<TokenResponse>(await response.Content.ReadAsStringAsync());
            // TODO: Replace with DeserializeServerErrorException to handle deserialization errors with a 500 status code
            return deserializedTokenResponse!;
        }

        var errorData = JsonConvert.DeserializeObject<GoogleErrorResponse>(await response.Content.ReadAsStringAsync());
        throw new BadRequestInvalidGrantException($"Error: {errorData!.Error} Description: {errorData.Error_Description}");
    }

    private static (string, string) GetEnvironmentVariables()
    {
        if (_environmentVariables == null)
        {
            _environmentVariables = [];

            var builder = WebApplication.CreateBuilder();

            string client_id;
            if (builder.Configuration["AppInfo:ClientId"] == "Secret")
            {
                client_id = Environment.GetEnvironmentVariable("CLIENT_ID")!;
            }
            else
            {
                client_id = builder.Configuration["AppInfo:ClientId"]!;
            }
            _environmentVariables.Add("CLIENT_ID", client_id);

            string client_secret;
            if (builder.Configuration["AppInfo:ClientSecret"] == "Secret")
            {
                client_secret = Environment.GetEnvironmentVariable("CLIENT_SECRET")!;
            }
            else
            {
                client_secret = builder.Configuration["AppInfo:ClientSecret"]!;
            }
            _environmentVariables.Add("CLIENT_SECRET", client_secret);
        }
        return (_environmentVariables["CLIENT_ID"], _environmentVariables["CLIENT_SECRET"]);
    }

    public async Task CreateTokens(TokenResponse tokenResponse)
    {
        var loggedInUser = new LoggedInUser()
        {
            Refresh_Token = tokenResponse.Refresh_token,
            Access_Token = tokenResponse.Access_token,
            Id_token = tokenResponse.Id_token
        };
        _context.LoggedInUser.Add(loggedInUser);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateTokens(TokenResponse tokenResponse, string access_token)
    {
        var user = await _context.LoggedInUser.FirstOrDefaultAsync(u => u.Access_Token == access_token) ?? throw new BadRequestInvalidGrantException("User not found");

        user.Access_Token = tokenResponse.Access_token;
        user.Id_token = tokenResponse.Id_token;

        _context.LoggedInUser.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<TokenResponse> RefreshTokens(string access_token)
    {
        var user = await _context.LoggedInUser.FirstOrDefaultAsync(u => u.Access_Token == access_token) ?? throw new BadRequestInvalidGrantException("User not found");
        var refreshToken = user.Refresh_Token ?? throw new BadRequestInvalidGrantException("Refresh token not found");

        return await GetTokensFromGoogle(null, null, refreshToken);
    }

    public Task DeleteTokens()
    {
        throw new NotImplementedException();
    }
}