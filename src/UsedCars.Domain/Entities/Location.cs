namespace UsedCars.Domain.Entities;

public class Location
{
    public int Id { get; set; }
    public string City { get; set; } = null!;
    public string Country { get; set; } = null!;
}