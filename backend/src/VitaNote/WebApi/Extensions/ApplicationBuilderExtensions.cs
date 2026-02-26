using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using VitaNote.WebApi.Middleware;

namespace VitaNote.WebApi.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseCustomExceptionMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        return app;
    }
    
    public static IApplicationBuilder UseCustomCors(this IApplicationBuilder app, string corsPolicy = "DefaultPolicy")
    {
        app.UseCors(corsPolicy);
        return app;
    }
}
