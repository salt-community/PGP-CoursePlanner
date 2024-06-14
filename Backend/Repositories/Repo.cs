using System.Diagnostics;
using Backend.Data;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Repositores;
public abstract class Repo<TEntity> where TEntity: class
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
}