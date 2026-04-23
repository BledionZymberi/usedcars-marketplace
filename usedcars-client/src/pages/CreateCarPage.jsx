import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateCarPage() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    year: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    description: "",
    brandId: "",
    carModelId: ""
  });

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    if (form.brandId) {
      loadModelsByBrand(form.brandId);
    } else {
      setModels([]);
    }
  }, [form.brandId]);

  const loadBrands = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadModelsByBrand = async (brandId) => {
    try {
      const res = await api.get(`/brands/${brandId}/models`);
      setModels(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/cars", {
        title: form.title,
        price: Number(form.price),
        year: Number(form.year),
        mileage: Number(form.mileage),
        fuelType: form.fuelType,
        transmission: form.transmission,
        description: form.description,
        brandId: Number(form.brandId),
        carModelId: Number(form.carModelId)
      });

      alert("Car created successfully");
      navigate("/cars");
    } catch (error) {
      alert(error?.response?.data || "Create failed");
    }
  };

  return (
    <div>
      <h1>Create Car</h1>

      <form onSubmit={handleSubmit}>
        <div><input name="title" placeholder="Title" value={form.title} onChange={handleChange} /></div>
        <div><input name="price" placeholder="Price" value={form.price} onChange={handleChange} /></div>
        <div><input name="year" placeholder="Year" value={form.year} onChange={handleChange} /></div>
        <div><input name="mileage" placeholder="Mileage" value={form.mileage} onChange={handleChange} /></div>
        <div><input name="fuelType" placeholder="Fuel Type" value={form.fuelType} onChange={handleChange} /></div>
        <div><input name="transmission" placeholder="Transmission" value={form.transmission} onChange={handleChange} /></div>
        <div><textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} /></div>

        <div>
          <select name="brandId" value={form.brandId} onChange={handleChange}>
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select name="carModelId" value={form.carModelId} onChange={handleChange}>
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}