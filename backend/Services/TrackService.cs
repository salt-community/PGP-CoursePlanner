using backend.Data;
using backend.ExceptionHandler.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TrackService(DataContext context) : IService<Track>
{
    private readonly DataContext _context = context;

    public async Task<List<Track>> GetAllAsync() => await _context.Tracks.OrderBy(track => track.Id).ToListAsync();

    public async Task<Track> GetOneAsync(int id) => await _context.Tracks.FindAsync(id) ?? throw new NotFoundByIdException("Track", id);

    public async Task<Track> CreateAsync(Track track)
    {
        var newTrack = _context.Tracks.Add(track);
        await _context.SaveChangesAsync();
        return newTrack.Entity;
    }

    public async Task<Track> UpdateAsync(int id, Track track)
    {
        var foundTrack = await _context.Tracks.FindAsync(id) ?? throw new NotFoundByIdException("Track", id);
        foundTrack.Name = track.Name;
        foundTrack.Color = track.Color;
        _context.Tracks.Update(foundTrack);
        await _context.SaveChangesAsync();
        return foundTrack;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var track = await _context.Tracks.FindAsync(id);
        if (track == null)
        {
            return true;
        }
        _context.Tracks.Remove(track);
        await _context.SaveChangesAsync();
        return true;
    }
}