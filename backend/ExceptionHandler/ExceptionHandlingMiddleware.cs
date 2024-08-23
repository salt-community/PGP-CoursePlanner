
using System.Net;
using backend.ExceptionHandler.Exceptions;

namespace backend.ExceptionHandler
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

            if (exception is NotFoundException<int> notFoundEx)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return context.Response.WriteAsJsonAsync(new
                {
                    status = context.Response.StatusCode,
                    message = notFoundEx.Message,
                    resource = notFoundEx.ResourceName,
                    resourceId = notFoundEx.ResourceId
                });
            }

            if (exception is BadRequestException<int> badReqEx)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return context.Response.WriteAsJsonAsync(new
                {
                    status = context.Response.StatusCode,
                    message = badReqEx.Message,
                    resource = badReqEx.ResourceName,
                    resourceId = badReqEx.ResourceId
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