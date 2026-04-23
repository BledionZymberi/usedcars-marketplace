import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditCarPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

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
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (form.brandId) {
      loadModelsByBrand(form.brandId);
    } else {
      setModels([]);
    }
  }, [form.brandId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [brandsRes, carRes] = await Promise.all([
        api.get("/brands"),
        api.get(`/cars/${id}`)
      ]);

      setBrands(brandsRes.data);

      const car = carRes.data;

      setForm({
        title: car.title || "",
        price: car.price || "",
        year: car.year || "",
        mileage: car.mileage || "",
        fuelType: car.fuelType || "",
        transmission: car.transmission || "",
        description: car.description || "",
        brandId: car.brandId || "",
        carModelId: car.carModelId || ""
      });

      if (car.brandId) {
        const modelsRes = await api.get(`/brands/${car.brandId}/models`);
        setModels(modelsRes.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load car data.");
    } finally {
      setLoading(false);
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
    const { name, value } = e.target;

    if (name === "brandId") {
      setForm({
        ...form,
        brandId: value,
        carModelId: ""
      });
      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/cars/${id}`, {
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

      alert("Car updated successfully");
      navigate("/cars");
    } catch (error) {
      alert(error?.response?.data || "Update failed");
    }
  };

  if (loading) {
    return <div style={styles.infoBox}>Loading car data...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Edit Car</h1>
        <p style={styles.subtitle}>Update the selected vehicle information.</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Price (€)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Year</label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mileage</label>
            <input
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Fuel Type</label>
            <input
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Transmission</label>
            <input
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Brand</label>
            <select
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Model</label>
            <select
              name="carModelId"
              value={form.carModelId}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" style={styles.primaryButton}>
            Save Changes
          </button>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/cars")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  page: {
    padding: "10px 0 30px 0"
  },
  header: {
    marginBottom: "20px"
  },
  title: {
    margin: 0,
    fontSize: "34px"
  },
  subtitle: {
    marginTop: "6px",
    color: "#555"
  },
  formCard: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "16px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "14px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600"
  },
  input: {
    height: "42px",
    padding: "0 12px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  },
  textarea: {
    minHeight: "120px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    resize: "vertical"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap"
  },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "600"
  },
  secondaryButton: {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "600"
  },
  infoBox: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px"
  }
};