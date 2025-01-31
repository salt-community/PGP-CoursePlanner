using backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TokensController(IServiceTokens<TokenResponse> service) : ControllerBase
    {
        private readonly IServiceTokens<TokenResponse> _service = service;

        [HttpGet("{auth_code}/{redirectUri}")]
        public async Task<JWTResponse> GetTokens(string auth_code, string redirectUri)
        {
            var response = await _service.GetTokensFromGoogle(auth_code, redirectUri, null);
            _service.CreateTokens(response);
            return (JWTResponse)response;
        }

        [HttpPut]
        public async Task<JWTResponse> UpdateTokens(TokenRequest token)
        {
            var response = await _service.RefreshTokens(token.Access_token);
            await _service.UpdateTokens(response, token.Access_token);
            return (JWTResponse)response;
        }

        // TODO: Implement delete user tokens endpoint
        [HttpDelete]
        public async Task<ActionResult> DeleteTokens()
        {
            await _service.DeleteTokens();
            return NoContent();
        }
    }
}