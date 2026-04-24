using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UsedCars.Application.DTOs.Cars;
using UsedCars.Domain.Entities;
using UsedCars.Infrastructure.Persistence;

namespace UsedCars.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? brandId,
            [FromQuery] int? carModelId,
            [FromQuery] int? tenantId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int? yearFrom,
            [FromQuery] int? yearTo,
            [FromQuery] string? fuelType,
            [FromQuery] string? transmission)
        {
            var query = _context.Cars
                .Include(x => x.Brand)
                .Include(x => x.CarModel)
                .Include(x => x.Tenant)
                .AsQueryable();

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            var tenantIdClaim = User.Claims.FirstOrDefault(x => x.Type == "TenantId")?.Value;

            // Multi-tenancy:
            // Dealer sheh vetëm veturat e tenant-it të vet.
            // Buyer/Admin/Guest shohin të gjitha dhe mund të filtrojnë sipas tenantId.
            if (role == "Dealer")
            {
                if (string.IsNullOrWhiteSpace(tenantIdClaim))
                    return BadRequest("TenantId missing in token.");

                int dealerTenantId = int.Parse(tenantIdClaim);
                query = query.Where(x => x.TenantId == dealerTenantId);
            }

            if (role != "Dealer" && tenantId.HasValue)
            {
                query = query.Where(x => x.TenantId == tenantId.Value);
            }

            if (brandId.HasValue)
                query = query.Where(x => x.BrandId == brandId.Value);

            if (carModelId.HasValue)
                query = query.Where(x => x.CarModelId == carModelId.Value);

            if (minPrice.HasValue)
                query = query.Where(x => x.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(x => x.Price <= maxPrice.Value);

            if (yearFrom.HasValue)
                query = query.Where(x => x.Year >= yearFrom.Value);

            if (yearTo.HasValue)
                query = query.Where(x => x.Year <= yearTo.Value);

            if (!string.IsNullOrWhiteSpace(fuelType))
                query = query.Where(x => x.FuelType == fuelType);

            if (!string.IsNullOrWhiteSpace(transmission))
                query = query.Where(x => x.Transmission == transmission);

            var cars = await query
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Price,
                    x.Year,
                    x.Mileage,
                    x.FuelType,
                    x.Transmission,
                    x.Description,
                    x.BrandId,
                    Brand = x.Brand.Name,
                    x.CarModelId,
                    Model = x.CarModel.Name,
                    x.TenantId,
                    TenantName = x.Tenant.Name
                })
                .ToListAsync();

            return Ok(cars);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var query = _context.Cars
                .Include(x => x.Brand)
                .Include(x => x.CarModel)
                .Include(x => x.Tenant)
                .Where(x => x.Id == id)
                .AsQueryable();

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            var tenantIdClaim = User.Claims.FirstOrDefault(x => x.Type == "TenantId")?.Value;

            // Dealer mund të hapë vetëm veturat e tenant-it të vet.
            if (role == "Dealer")
            {
                if (string.IsNullOrWhiteSpace(tenantIdClaim))
                    return BadRequest("TenantId missing in token.");

                int dealerTenantId = int.Parse(tenantIdClaim);
                query = query.Where(x => x.TenantId == dealerTenantId);
            }

            var car = await query
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Price,
                    x.Year,
                    x.Mileage,
                    x.FuelType,
                    x.Transmission,
                    x.Description,
                    x.BrandId,
                    Brand = x.Brand.Name,
                    x.CarModelId,
                    Model = x.CarModel.Name,
                    x.TenantId,
                    TenantName = x.Tenant.Name
                })
                .FirstOrDefaultAsync();

            if (car == null)
                return NotFound();

            return Ok(car);
        }

        [Authorize(Roles = "Dealer")]
        [HttpPost]
        public async Task<IActionResult> Create(CarCreateDto dto)
        {
            var tenantIdClaim = User.Claims.FirstOrDefault(x => x.Type == "TenantId")?.Value;

            if (string.IsNullOrWhiteSpace(tenantIdClaim))
                return BadRequest("TenantId missing in token.");

            int tenantId = int.Parse(tenantIdClaim);

            var brandExists = await _context.Brands.AnyAsync(x => x.Id == dto.BrandId);
            if (!brandExists)
                return BadRequest("Brand does not exist.");

            var modelExists = await _context.CarModels
                .AnyAsync(x => x.Id == dto.CarModelId && x.BrandId == dto.BrandId);

            if (!modelExists)
                return BadRequest("Car model does not exist for selected brand.");

            var car = new Car
            {
                Title = dto.Title,
                Price = dto.Price,
                Year = dto.Year,
                Mileage = dto.Mileage,
                FuelType = dto.FuelType,
                Transmission = dto.Transmission,
                Description = dto.Description,
                BrandId = dto.BrandId,
                CarModelId = dto.CarModelId,
                TenantId = tenantId
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Car created successfully.",
                carId = car.Id
            });
        }

        [Authorize(Roles = "Dealer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CarUpdateDto dto)
        {
            var tenantIdClaim = User.Claims.FirstOrDefault(x => x.Type == "TenantId")?.Value;

            if (string.IsNullOrWhiteSpace(tenantIdClaim))
                return BadRequest("TenantId missing in token.");

            int tenantId = int.Parse(tenantIdClaim);

            var car = await _context.Cars
                .FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId);

            if (car == null)
                return NotFound();

            var brandExists = await _context.Brands.AnyAsync(x => x.Id == dto.BrandId);
            if (!brandExists)
                return BadRequest("Brand does not exist.");

            var modelExists = await _context.CarModels
                .AnyAsync(x => x.Id == dto.CarModelId && x.BrandId == dto.BrandId);

            if (!modelExists)
                return BadRequest("Car model does not exist for selected brand.");

            car.Title = dto.Title;
            car.Price = dto.Price;
            car.Year = dto.Year;
            car.Mileage = dto.Mileage;
            car.FuelType = dto.FuelType;
            car.Transmission = dto.Transmission;
            car.Description = dto.Description;
            car.BrandId = dto.BrandId;
            car.CarModelId = dto.CarModelId;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Car updated successfully."
            });
        }

        [Authorize(Roles = "Dealer")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tenantIdClaim = User.Claims.FirstOrDefault(x => x.Type == "TenantId")?.Value;

            if (string.IsNullOrWhiteSpace(tenantIdClaim))
                return BadRequest("TenantId missing in token.");

            int tenantId = int.Parse(tenantIdClaim);

            var car = await _context.Cars
                .FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId);

            if (car == null)
                return NotFound();

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Car deleted successfully."
            });
        }
    }
}