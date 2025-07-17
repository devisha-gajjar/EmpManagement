// using System.Net;
// using System.Text.Json;
// using EmployeeAPI.Entities.DTO;

// namespace EmployeeAPI.Middlewares;

// public class ExceptionHandlingMiddleware
// {
//     private readonly RequestDelegate _next;
//     private readonly ILogger<ExceptionHandlingMiddleware> _logger;

//     public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
//     {
//         _next = next;
//         _logger = logger;
//     }

//     public async Task Invoke(HttpContext context)
//     {
//         try
//         {
//             await _next(context); // Call next middleware
//         }
//         catch (AppException ex)
//         {
//             context.Response.StatusCode = ex.StatusCode;
//             context.Response.ContentType = "application/json";
//             var response = ApiResponse<string>.Fail(ex.Message, ex.StatusCode);
//             await context.Response.WriteAsync(JsonSerializer.Serialize(response));
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine(ex);
//             context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
//             context.Response.ContentType = "application/json";
//             var response = ApiResponse<string>.Fail("An unexpected error occurred.", 500);
//             await context.Response.WriteAsync(JsonSerializer.Serialize(response));
//         }

//     }
// }


using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using EmployeeAPI.Entities.DTO;

namespace EmployeeAPI.Middlewares;

public class ExceptionHandlingMiddleware : IMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (AppException ex)
        {
            _logger.LogWarning(ex,
               "AppException: {Message} | Path: {Path} | TraceId: {TraceId}",
               ex.Message, context.Request.Path, context.TraceIdentifier);

            context.Response.StatusCode = ex.StatusCode;
            context.Response.ContentType = "application/json";
            var response = ApiResponse<string>.Fail(ex.Message, ex.StatusCode);
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex,
                "AppException: {Message} | Path: {Path} | TraceId: {TraceId}",
                ex.Message, context.Request.Path, context.TraceIdentifier);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            var response = ApiResponse<string>.Fail("An unexpected error occurred.", 500);
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
