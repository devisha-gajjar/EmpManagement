namespace EmployeeAPI.Services.IServices;

public interface IMemoryCacheService
{
    T GetOrSet<T>(string key, Func<T> getData);
    void Clear(string key);
}