namespace backend.Services;

public interface IServiceTokens<T>
{
    public Task<T> GetTokensFromGoogle(string auth_code, string redirectUri);
    public void StoreTokens(T tokenResponse);
    public Task<T> UpdateTokens(string access_token);
    public Task DeleteTokens();
}