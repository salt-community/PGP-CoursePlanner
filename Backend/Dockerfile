# Base image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

# Set the working directory
WORKDIR /app

# Copy the project file and restore dependencies
COPY Backend.csproj .
RUN dotnet restore Backend.csproj

# Copy the source code and build the application
COPY . .
RUN dotnet publish -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Set the working directory
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build-env /app/out .

# Expose the port
EXPOSE 8080

# Set the PORT environment variable for ASP.NET Core
ENV ASPNETCORE_URLS=http://+:8080
ENV PORT=8080

# Set environment variables for the application
ENV ConnectionStrings__DataContext="Data Source=your-database.db"

# Start the application
ENTRYPOINT ["dotnet", "Backend.dll"]
