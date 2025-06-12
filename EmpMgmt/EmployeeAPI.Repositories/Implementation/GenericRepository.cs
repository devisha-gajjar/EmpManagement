namespace EmployeeAPI.Repositories.Repositories;

using EmployeeAPI.Entities.Data;
using EmployeeAPI.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly EmployeeMgmtContext _context;
    private readonly DbSet<T> _dbSet;

    public GenericRepository(EmployeeMgmtContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public IEnumerable<T> GetAll()
    {
        return _dbSet.ToList();
    }

    public T GetById(object id)
    {
        return _dbSet.Find(id);
    }

    public void Add(T entity)
    {
        _dbSet.Add(entity);
    }

    public void Update(T entity)
    {
        _dbSet.Attach(entity);
        _context.Entry(entity).State = EntityState.Modified;
    }

    public void Delete(T entity)
    {
        if (_context.Entry(entity).State == EntityState.Detached)
        {
            _dbSet.Attach(entity);
        }
        _dbSet.Remove(entity);
    }

    public void Save()
    {
        _context.SaveChanges();
    }
}
