using System.Linq.Expressions;
using EmployeeAPI.Entities.Data;
using EmployeeAPI.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;


namespace EmployeeAPI.Repositories.Implementation;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly EmployeeMgmtContext _db;

    public GenericRepository(EmployeeMgmtContext db)
    {
        _db = db;
    }

    public T? GetById(int id)
    {
        return _db.Set<T>().Find(id);
    }

    public IQueryable<T> GetAll()
    {
        return _db.Set<T>();
    }

    public void Add(T entity)
    {
        _db.Set<T>().Add(entity);
        Save();
    }

    public void AddRange(IEnumerable<T> entities)
    {
        _db.Set<T>().AddRange(entities);
        Save();
    }

    public void Update(T entity)
    {
        _db.Set<T>().Update(entity);
        Save();
    }

    public void UpdateRange(IEnumerable<T> entities)
    {
        _db.Set<T>().UpdateRange(entities);
        Save();
    }

    public void Save() => _db.SaveChanges();

    public void Delete(T entity)
    {
        _db.Set<T>().Remove(entity);
        Save();
    }

    public IQueryable<T> GetQueryableInclude(Expression<Func<T, object>>[] includes = null, string[] deepIncludes = null)
    {
        IQueryable<T> query = _db.Set<T>().AsNoTracking();

        if (includes != null)
        {
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
        }

        if (deepIncludes != null)
        {
            foreach (var deepInclude in deepIncludes)
            {
                query = query.Include(deepInclude);
            }
        }

        return query;
    }

}
