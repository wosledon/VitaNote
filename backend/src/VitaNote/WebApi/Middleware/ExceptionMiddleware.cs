using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace VitaNote.WebApi.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }
    
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = exception switch
        {
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            InvalidOperationException => (int)HttpStatusCode.BadRequest,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            _ => (int)HttpStatusCode.InternalServerError
        };
        
        var problemDetails = new ProblemDetails
        {
            Status = context.Response.StatusCode,
            Title = exception.Message,
            Detail = exception.StackTrace
        };
        
        if (context.Response.StatusCode == (int)HttpStatusCode.InternalServerError)
        {
            problemDetails.Title = "An internal server error occurred";
            problemDetails.Detail = "Please try again later.";
        }
        
        return context.Response.WriteAsJsonAsync(problemDetails);
    }
}
