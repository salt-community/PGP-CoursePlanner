using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TrackService(DataContext context) : IService<Track>
{
    private readonly DataContext _context = context;

    public async Task<List<Track>> GetAllAsync() => await _context.Tracks.ToListAsync();

    public async Task<Track> GetOneAsync(int id) => await _context.Tracks.FindAsync(id) ?? throw new NotFoundByIdException("Track", id);

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