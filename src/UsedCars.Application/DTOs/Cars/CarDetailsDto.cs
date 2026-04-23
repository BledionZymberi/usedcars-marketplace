namespace UsedCars.Application.DTOs.Cars
{
    public class CarDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public decimal Price { get; set; }
        public int Year { get; set; }
        public int Mileage { get; set; }
        public string FuelType { get; set; } = null!;
        public string Transmission { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int BrandId { get; set; }
        public string Brand { get; set; } = null!;
        public int CarModelId { get; set; }
        public string Model { get; set; } = null!;
        public int TenantId { get; set; }
    }
}