using backend.Controllers;
using backend.ExceptionHandler.Exceptions;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Tests.UnitTests;

public class TokensControllerUnitTests
{
    readonly Mock<IServiceTokens<TokenResponse>> _mockService = new();
    readonly TokenResponse tokenResponse = new()
    {
        Access_token = "access_token",
        Id_token = "id_token",
        Refresh_token = "refresh_token",
        Expires_in = 1,
        Scope = "scope",
        Token_type = "token_type"
    };

    [Fact]
    public async void GetTokens_Returns_JWTResponse()
    {
        // arrange
        var expectedResponse = (JWTResponse)tokenResponse;

        _mockService.Setup(service => service.GetTokensFromGoogle("auth_code", "redirectUri", null)).ReturnsAsync(tokenResponse);
        _mockService.Setup(service => service.CreateTokens(tokenResponse));
        var controller = new TokensController(_mockService.Object);

        // act
        var result = await controller.GetTokens("auth_code", "redirectUri");

        // assert
        result.Should().BeAssignableTo<JWTResponse>();
        result.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async void GetTokens_Return_BadRequest_with_Message()
    {
        // arrange
        _mockService.Setup(service => service.GetTokensFromGoogle("auth_code", "redirectUri", null)).ThrowsAsync(new BadRequestInvalidGrantException("Error: Type of Error. Description: Error Description."));
        var controller = new TokensController(_mockService.Object);

        // act
        var exception = await Record.ExceptionAsync(() => controller.GetTokens("auth_code", "redirectUri"));

        // assert
        exception.Should().BeOfType<BadRequestInvalidGrantException>();
        exception.Message.Should().Be("Error: Type of Error. Description: Error Description.");
    }
}