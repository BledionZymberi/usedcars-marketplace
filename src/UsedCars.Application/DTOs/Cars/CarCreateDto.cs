namespace UsedCars.Application.DTOs.Cars
{
    public class CarCreateDto
    {
        public string Title { get; set; } = null!;
        public decimal Price { get; set; }
        public int Year { get; set; }
        public int Mileage { get; set; }
        public string FuelType { get; set; } = null!;
        public string Transmission { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int BrandId { get; set; }
        public int CarModelId { get; set; }
    }
}