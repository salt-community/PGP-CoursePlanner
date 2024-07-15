using Backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class TeamService : IService<Team>
    {
        private readonly List<Team> _teams = new List<Team>();

        public Task<Team> CreateAsync(Team team)
        {
            team.Id = _teams.Count + 1;
            _teams.Add(team);
            return Task.FromResult(team);
        }

        public Task<List<Team>> GetAllAsync()
        {
            return Task.FromResult(_teams.ToList());
        }

        public Task<Team> GetOneAsync(int id)
        {
            var team = _teams.FirstOrDefault(t => t.Id == id);
            return Task.FromResult(team);
        }

        public Task<Team> UpdateAsync(int id, Team team)
        {
            var existingTeam = _teams.FirstOrDefault(t => t.Id == id);
            if (existingTeam != null)
            {
                existingTeam.Name = team.Name;
                existingTeam.Emails = team.Emails;
            }
            return Task.FromResult(existingTeam);
        }

        public Task<bool> DeleteAsync(int id)
        {
            var team = _teams.FirstOrDefault(t => t.Id == id);
            if (team != null)
            {
                _teams.Remove(team);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
    }
}
