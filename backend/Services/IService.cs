namespace backend.Services;

public interface IService<T>
{
    Task<List<T>> GetAllAsync();
    Task<T> GetOneAsync(int id);
    Task<T> CreateAsync(T T);
    Task UpdateAsync(int id, T T);
    Task DeleteAsync(int id);
}