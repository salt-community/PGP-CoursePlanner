
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StartDatesController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<StartDate>> CreateStartDate (DateTime startDate)
        {
            
        }

    }
}