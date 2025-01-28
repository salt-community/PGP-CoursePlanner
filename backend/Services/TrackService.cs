using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TrackService(DataContext context) : IService<Track>
{
    private readonly DataContext _context = context;

    public async Task<List<Track>> GetAllAsync() => await _context.Tracks.ToListAsync();

    public Task<Track> GetOneAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Track> CreateAsync(Track T)
    {
        throw new NotImplementedException();
    }

    public Task<Track> UpdateAsync(int id, Track T)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }
}