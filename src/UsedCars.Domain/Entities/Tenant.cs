namespace UsedCars.Domain.Entities
{
    public class Tenant
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Car> Cars { get; set; } = new List<Car>();
    }
}