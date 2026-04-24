namespace UsedCars.Domain.Entities;

public class CarImage
{
    public int Id { get; set; }

    public int CarId { get; set; }
    public Car Car { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;
    public bool IsMain { get; set; }
}