using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DataContext") ?? throw new InvalidOperationException("Connection string 'DataContext' not found.")));

builder.Services.AddCors();

builder.Services.AddScoped<IService<Module>, ModuleService>();
builder.Services.AddScoped<IService<Course>, CourseService>();
builder.Services.AddScoped<IService<AppliedCourse>, AppliedCourseService>();    

var app = builder.Build();

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowAnyOrigin());

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Use Kestrel and listen on the port specified by the PORT environment variable
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

// DONT CHANGE THIS LINE, YOU WILL BREAK THE CODE
app.Urls.Add($"http://*:{port}");

app.Run();

public partial class Program {}
