using System.Linq.Expressions;
using System.Reflection;
using AutoMapper;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Helper;
using EmployeeAPI.Entities.Models;
using EmployeeAPI.Repositories.IRepositories;
using EmployeeAPI.Services.IServices;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Services.Implementation;

public class DropDownDataService(
    IMapper _mapper,
    IMemoryCacheService _cacheService,
    IGenericRepository<Role> roleRepository
) : IDropDownDataService
{
    public List<CommonListDropDownDto> GetDropDownListData(DropDownType dropDownType)
    {
        return _cacheService.GetOrSet($"{dropDownType}", () =>
        {
            var query = GetRepository(dropDownType);
            return ApplyDefaultFilters(query);
        });
    }

    private IQueryable<object> GetRepository(DropDownType dropDownType)
    {
        return dropDownType switch
        {
            DropDownType.Role => roleRepository.GetQueryableInclude(),
            _ => throw new ArgumentOutOfRangeException(nameof(dropDownType), dropDownType, null)
        };
    }

    private List<CommonListDropDownDto> ApplyDefaultFilters(IQueryable<object> query)
    {
        // Dynamically build expression trees if possible
        Type? entityType = query.ElementType;

        ParameterExpression? parameter = Expression.Parameter(entityType, "x");

        // IsDeleted filter
        PropertyInfo? isDeletedProp = entityType.GetProperty(Constants.IS_DELETED);
        if (isDeletedProp is not null && isDeletedProp.PropertyType == typeof(bool))
        {
            MemberExpression? isDeletedAccess = Expression.Property(parameter, isDeletedProp);
            UnaryExpression? notIsDeleted = Expression.Not(isDeletedAccess);
            LambdaExpression? lambda = Expression.Lambda(notIsDeleted, parameter);

            MethodInfo? whereMethod = typeof(Queryable).GetMethods()
                .First(m => m.Name == Constants.WHERE && m.GetParameters().Length == 2)
                .MakeGenericMethod(entityType);

            query = (IQueryable<object>)whereMethod.Invoke(null, new object[] { query, lambda })!;
        }

        // OrderBy Id
        PropertyInfo? idProp = entityType.GetProperty(Constants.ID);
        if (idProp is not null && idProp.PropertyType == typeof(int))
        {
            MemberExpression? idAccess = Expression.Property(parameter, idProp);
            LambdaExpression? lambda = Expression.Lambda(idAccess, parameter);

            MethodInfo? orderByMethod = typeof(Queryable).GetMethods()
                .First(m => m.Name == Constants.ORDER_BY && m.GetParameters().Length == 2)
                .MakeGenericMethod(entityType, typeof(int));

            query = (IQueryable<object>)orderByMethod.Invoke(null, new object[] { query, lambda })!;
        }

        return _mapper.ProjectTo<CommonListDropDownDto>(query).ToList();
    }

    public void ClearCache(DropDownType dropDownType)
    {
        _cacheService.Clear($"{dropDownType}");
    }
}
