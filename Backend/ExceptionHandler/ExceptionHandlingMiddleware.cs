
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ExceptionHandler
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An unhandled exception has occured: {Message}", exception.Message);

                await HandleExceptionAsync(context, exception);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            if (exception is NotFoundException<int> ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return context.Response.WriteAsJsonAsync(new
                {
                    status = context.Response.StatusCode,
                    message = ex.Message,
                    resource = ex.ResourceName,
                    resourceId = ex.ResourceId
                });
            }

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            var response = new
            {
                status = context.Response.StatusCode,
                message = "An error occurres while processing your request.",
                detailed = exception.Message
            };

            return context.Response.WriteAsJsonAsync(response);
        }
    }
}