namespace backend.Services;

public interface IServiceTokens<T>
{
    public Task<T> GetTokensFromGoogle(string? auth_code, string? redirectUrl, string? refresh_token);
    public Task CreateTokens(T tokenResponse);
    public Task<T> RefreshTokens(string access_token);
    public Task UpdateTokens(T tokenResponse, string access_token);
    public Task DeleteTokens();
}