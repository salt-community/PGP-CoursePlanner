using backend.Config;
using backend.Data;
using backend.ExceptionHandler;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string deploymentDevelop = Environment.GetEnvironmentVariable("ConnectionStringDeployedDevelop")!;
string? connectionString = builder.Environment.IsDevelopment() ?
                        builder.Configuration.GetConnectionString("DevelopmentDb") : //Change this variable to update all three databases
                        Environment.GetEnvironmentVariable("ConnectionStringDeployed");

builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(connectionString ?? deploymentDevelop ?? throw new InvalidOperationException("Connection string 'DevelopmentDb' or 'ConnectionStringDeployed' not found.")));

var JwtSecurityScheme = new OpenApiSecurityScheme()
{
    Type = SecuritySchemeType.Http,
    Scheme = "bearer"
};
var JwtSecurityRequirement = new OpenApiSecurityRequirement()
{
    [new() { Reference = new() { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }] = []
};
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", JwtSecurityScheme);
    options.AddSecurityRequirement(SecurityConfig.JwtSecurityRequirement);
});

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.Authority = "https://accounts.google.com";
    options.Audience = "735865474111-hbubksmrfl5l6b7tkgnjetiuqp1jvoeh.apps.googleusercontent.com";
    options.TokenValidationParameters.ValidIssuer = "accounts.google.com";
});

builder.Services.AddCors();

builder.Services.AddScoped<IService<Module>, ModuleService>();
builder.Services.AddScoped<IService<Course>, CourseService>();
builder.Services.AddScoped<IService<Day>, DayService>();
builder.Services.AddScoped<IService<Track>, TrackService>();
builder.Services.AddScoped<IServiceTokens<TokenResponse>, TokenService>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowAnyOrigin());

if (app.Environment.IsDevelopment() || deploymentDevelop != null)
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
}


// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

app.MapControllers();

app.UseAuthorization();

// Use Kestrel and listen on the port specified by the PORT environment variable
// var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

// // DONT CHANGE THIS LINE, YOU WILL BREAK THE CODE
// app.Urls.Add($"http://*:{port}");

app.Run();
//remove this comment
public partial class Program { }