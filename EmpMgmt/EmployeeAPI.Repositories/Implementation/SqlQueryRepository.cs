using EmployeeAPI.Entities.Data;
using EmployeeAPI.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Repositories.Implementation;

public class SqlQueryRepository(EmployeeMgmtContext _context) : ISqlQueryRepository
{
    public async Task<TResult> SqlQuerySingleAsync<TResult>(string sql, params object[] parameters) where TResult : class
    {
        return await _context.Database
                             .SqlQueryRaw<TResult>(sql, parameters)
                             .AsNoTracking()
                             .SingleAsync();
    }

    public async Task<List<TResult>> SqlQueryListAsync<TResult>(string sql, params object[] parameters) where TResult : class
    {
        return await _context.Database
                             .SqlQueryRaw<TResult>(sql, parameters)
                             .AsNoTracking()
                             .ToListAsync();
    }
}
