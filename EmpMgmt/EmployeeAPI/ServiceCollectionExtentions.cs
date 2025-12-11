using EmployeeAPI.Entities.Mapper;
using EmployeeAPI.Repositories.Implementation;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services;
using EmployeeAPI.Services.Implementation;
using EmployeeAPI.Services.IServices;

namespace EmployeeAPI;


public static class ServiceCollectionExtensions
{
    public static void RegisterDependency(this IServiceCollection services)
    {
        // services
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICustomService, CustomService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<ILeaveService, LeaveService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IProjectMemberService, ProjectMemberService>();

        //mappers
        services.AddAutoMapper(typeof(MappingProfile));

        // repository
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ILeaveRepository, LeaveRepository>();
    }
}