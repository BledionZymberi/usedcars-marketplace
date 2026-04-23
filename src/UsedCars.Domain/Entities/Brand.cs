namespace UsedCars.Domain.Entities
{
    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<CarModel> Models { get; set; } = new List<CarModel>();
    }
}