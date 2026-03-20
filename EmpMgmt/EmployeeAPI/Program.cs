using System.Net;
using System.Security.Claims;
using System.Text;
using EmployeeAPI;
using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Hubs;
using EmployeeAPI.Middlewares;
using EmployeeAPI.Services.Implementation;
using EmployeeAPI.Services.IServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Polly;
using Polly.Extensions.Http;
using Prometheus;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog logging
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 7
    )
    .CreateLogger();

builder.Host.UseSerilog();


// register all service - repo depenedency
builder.Services.RegisterDependency();

builder.Services
            .AddHttpClient<IGeoLocationService, GeoLocationService>()
            .AddPolicyHandler(GetRetryPolicy());


// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// db contect
builder.Services.AddDbContext<EmployeeMgmtContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// exception handler
builder.Services.AddScoped<ExceptionHandlingMiddleware>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();

// SignalR  
builder.Services.AddSignalR();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Employee API", Version = "v1" });

    c.AddSecurityDefinition(Constants.BEARER, new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = Constants.BEARER
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = Constants.BEARER },
                Scheme = "oauth2",
                Name = Constants.BEARER,
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

builder.Services.AddAuthorization();

var jwtSecret =
    builder.Configuration["JWT_SECRET"]
    ?? Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? throw new Exception(Constants.JWT_KEY_ERROR_MESSAGE);

var signingKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(jwtSecret)
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/leaveHub") || path.StartsWithSegments("/notification"))) // match your hub path
            {
                context.Token = accessToken;
            }

            if (context.Token == null && context.Request.Cookies.ContainsKey("Token"))
            {
                context.Token = context.Request.Cookies["Token"];
            }

            return Task.CompletedTask;
        }
    };
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = signingKey,
        RoleClaimType = ClaimTypes.Role
    };
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!;
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError() // 5xx, 408
        .OrResult(r => r.StatusCode == HttpStatusCode.TooManyRequests)
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt =>
                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))
        );
}


var app = builder.Build();

app.UseSerilogRequestLogging();

// Register global exception middleware
app.Use(async (context, next) =>
{
    var middleware = context.RequestServices.GetRequiredService<ExceptionHandlingMiddleware>();
    await middleware.InvokeAsync(context, next);
});

// Configure middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpMetrics();
app.MapMetrics();

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseForwardedHeaders();

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();
app.MapControllers();

app.MapHub<LeaveHub>("/leaveHub");
app.MapHub<NotificationHub>("/notification");

await app.RunAsync();
