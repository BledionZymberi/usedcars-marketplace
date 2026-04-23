using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UsedCars.Infrastructure.Persistence;

namespace UsedCars.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var brands = await _context.Brands
                .Select(x => new
                {
                    x.Id,
                    x.Name
                })
                .ToListAsync();

            return Ok(brands);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var brand = await _context.Brands
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.Id,
                    x.Name
                })
                .FirstOrDefaultAsync();

            if (brand == null)
                return NotFound();

            return Ok(brand);
        }

        [HttpGet("{id}/models")]
        public async Task<IActionResult> GetModelsByBrandId(int id)
        {
            var models = await _context.CarModels
                .Where(x => x.BrandId == id)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.BrandId
                })
                .ToListAsync();

            return Ok(models);
        }
    }
}