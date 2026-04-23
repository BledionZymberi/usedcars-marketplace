using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UsedCars.Infrastructure.Persistence;

namespace UsedCars.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarModelsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarModelsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var models = await _context.CarModels
                .Include(x => x.Brand)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.BrandId,
                    BrandName = x.Brand.Name
                })
                .ToListAsync();

            return Ok(models);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var model = await _context.CarModels
                .Include(x => x.Brand)
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.BrandId,
                    BrandName = x.Brand.Name
                })
                .FirstOrDefaultAsync();

            if (model == null)
                return NotFound();

            return Ok(model);
        }
    }
}