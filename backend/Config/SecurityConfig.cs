
using Microsoft.OpenApi.Models;

namespace backend.Config
{
    public static class SecurityConfig
    {
        public static readonly OpenApiSecurityScheme JwtSecurityScheme = new()
        {
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer"
        };
        public static readonly OpenApiSecurityRequirement JwtSecurityRequirement = new()
        {
            [new() { Reference = new() { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }] = []
        };
    }
}