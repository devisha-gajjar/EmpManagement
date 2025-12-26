// using System.Text;
// using EmployeeAPI.Entities.Data;
// using EmployeeAPI.Middlewares;
// using EmployeeAPI.Repositories.Implementation;
// using EmployeeAPI.Repositories.IRepositories;
// using EmployeeAPI.Repositories.Repositories;
// using EmployeeAPI.Services.Implementation;
// using EmployeeAPI.Services.IServices;
// using EmployeeAPI.Services.Services;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens;
// using Microsoft.OpenApi.Models;

// using NLog;
// using NLog.Web;

// var logger = LogManager.Setup()
//     .LoadConfigurationFromFile("nlog.config")
//     .GetCurrentClassLogger();

// try
// {
//     logger.Info("🔧 Application is starting up");

//     var builder = WebApplication.CreateBuilder(args);

//     builder.Logging.ClearProviders(); // Remove default logging providers
//     builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Information);
//     builder.Host.UseNLog(); // Enable NLog

//     // Add services to the container.

//     // builder.Services.AddControllers();

//     builder.Services.AddControllers()
//         .AddJsonOptions(options =>
//         {
//             options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
//         });

//     builder.Services.AddScoped<IDepartmentService, DepartmentService>();
//     builder.Services.AddScoped<IEmployeeService, EmployeeService>();
//     builder.Services.AddScoped<IAuthService, AuthService>();
//     builder.Services.AddScoped<ICustomService, CustomService>();

//     builder.Services.AddDbContext<EmployeeMgmtContext>(options =>
//         options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


//     builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
//     builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
//     builder.Services.AddScoped<IUserRepository, UserRepository>();


//     builder.Services.AddScoped<ExceptionHandlingMiddleware>(); // 2. register IMiddleware


//     // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//     builder.Services.AddEndpointsApiExplorer();
//     builder.Services.AddSwaggerGen(c =>
//     {
//         c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Employee API", Version = "v1" });

//         // Define the security scheme
//         c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//         {
//             Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
//             Name = "Authorization",
//             In = ParameterLocation.Header,
//             Type = SecuritySchemeType.ApiKey,
//             Scheme = "Bearer"
//         });

//         // Require the bearer token globally
//         c.AddSecurityRequirement(new OpenApiSecurityRequirement()
//         {
//         {
//             new OpenApiSecurityScheme
//             {
//                 Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
//                 Scheme = "oauth2",
//                 Name = "Bearer",
//                 In = ParameterLocation.Header,
//             },
//             new List<string>()
//         }
//         });
//     });

//     builder.Services.AddAuthorization();
//     builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
//     {
//         options.Events = new JwtBearerEvents
//         {
//             OnMessageReceived = context =>
//                 {
//                     if (context.Request.Cookies.ContainsKey("Token"))
//                     {
//                         context.Token = context.Request.Cookies["Token"];
//                     }
//                     return Task.CompletedTask;
//                 }
//         };
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,
//             ValidIssuer = builder.Configuration["Jwt:Issuer"],
//             ValidAudience = builder.Configuration["Jwt:Issuer"],
//             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
//         };
//     });

//     var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!;

//     builder.Services.AddCors(options =>
//     {
//         options.AddPolicy("AllowAll", policy =>
//         {
//             policy.WithOrigins(allowedOrigins)
//                   .AllowAnyMethod()
//                   .AllowAnyHeader()
//                   .AllowCredentials(); ;
//         });
//     });

//     var app = builder.Build();

//     // 1.  app.UseMiddleware<ExceptionHandlingMiddleware>();


//     app.Use(async (context, next) =>
//     {
//         var middleware = context.RequestServices.GetRequiredService<ExceptionHandlingMiddleware>();
//         await middleware.InvokeAsync(context, next);
//     });                         // 2. IMiddleware


//     // Configure the HTTP request pipeline.
//     if (app.Environment.IsDevelopment())
//     {
//         app.UseSwagger();
//         app.UseSwaggerUI();
//     }

//     app.UseHttpsRedirection();

//     app.UseCors("AllowAll");

//     app.UseAuthentication();
//     app.UseAuthorization();

//     app.MapControllers();

//     app.Run();
// }
// catch (Exception ex)
// {
//     logger.Error(ex, "❌ Application stopped due to an exception");
//     throw;
// }
// finally
// {
//     LogManager.Shutdown();
// }

using System.Security.Claims;
using System.Text;
using EmployeeAPI;
using EmployeeAPI.Entities.Data;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Hubs;
using EmployeeAPI.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Default logging 
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// register all service - repo depenedency
builder.Services.RegisterDependency();

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
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/leaveHub"))   // match your hub path
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
        ValidAudience = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
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

var app = builder.Build();

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

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<LeaveHub>("/leaveHub");
app.MapHub<NotificationHub>("/notification");

await app.RunAsync();
