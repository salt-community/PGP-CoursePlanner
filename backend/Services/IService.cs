namespace backend.Services;

public interface IService <T>
{
    Task<T> CreateAsync(T T);
    Task<List<T>> GetAllAsync();
    Task<T> GetOneAsync(int id);
    Task<T> UpdateAsync(int id, T T);
    Task<bool> DeleteAsync(int id);
}