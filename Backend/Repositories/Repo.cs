using System.Diagnostics;
using System.Linq.Expressions;
using Backend.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositores;
public abstract class Repo<TEntity> where TEntity : class
{
    private readonly DataContext _context;
    protected Repo(DataContext context)
    {
        _context = context;
    }
    public async virtual Task<TEntity> CreateAsync(TEntity entity)
    {
        try
        {
            _context.Set<TEntity>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;

    }
    public async virtual Task<IEnumerable<TEntity>> GetAllAsync()
    {
        try
        {
            return await _context.Set<TEntity>().ToListAsync();
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;

    }
    public async virtual Task<TEntity> GetSpecificAsync(Expression<Func<TEntity, bool>> predicate)
    {
        try
        {
            var item = await _context.Set<TEntity>().FirstOrDefaultAsync(predicate);
            return item ?? null!;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;

    }

    public async virtual Task<TEntity> UpdateAsync(TEntity entity)
    {
        try
        {
            _context.Set<TEntity>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return null!;

    }

    public async virtual Task<bool> DeleteAsync(Expression<Func<TEntity, bool>> predicate)
    {
        try
        {
            var item = await _context.Set<TEntity>().FirstOrDefaultAsync(predicate);
            if (item != null)
            {
                _context.Set<TEntity>().Remove(item);
                await _context.SaveChangesAsync();
                return true;
            }

        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;

    }

    public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> expression)
    {
        try
        {
            var item = await _context.Set<TEntity>().AnyAsync(expression);
            return item;
        }
        catch (Exception ex) { Debug.WriteLine(ex.Message); }
        return false;
    }
}