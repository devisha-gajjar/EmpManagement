using System.Linq.Expressions;

namespace EmployeeAPI.Repositories.IRepositories;

public interface IGenericRepository<T> where T : class
{
    T? GetById(int id);
    IQueryable<T> GetAll();
    void Add(T entity);
    void AddRange(IEnumerable<T> entities);
    void Update(T entity);
    public void UpdateRange(IEnumerable<T> entities);
    public void Delete(T entity);
    void Save();
    IQueryable<T> GetQueryableInclude(Expression<Func<T, object>>[] includes = null, string[] deepIncludes = null);
}
