import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CarsPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    brandId: "",
    minPrice: "",
    maxPrice: ""
  });

  useEffect(() => {
    loadBrands();
    loadCars();
  }, []);

  const loadBrands = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Failed to load brands:", error);
    }
  };

  const loadCars = async (customFilters = filters) => {
    try {
      setLoading(true);

      const params = {};

      if (customFilters.brandId) params.brandId = customFilters.brandId;
      if (customFilters.minPrice) params.minPrice = customFilters.minPrice;
      if (customFilters.maxPrice) params.maxPrice = customFilters.maxPrice;

      const res = await api.get("/cars", { params });
      setCars(res.data);
    } catch (error) {
      console.error("Failed to load cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    await loadCars(filters);
  };

  const handleReset = async () => {
    const resetFilters = {
      brandId: "",
      minPrice: "",
      maxPrice: ""
    };

    setFilters(resetFilters);
    await loadCars(resetFilters);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this car?");
    if (!confirmed) return;

    try {
      await api.delete(`/cars/${id}`);
      await loadCars();
    } catch (error) {
      alert(error?.response?.data || "Delete failed");
    }
  };

  const isDealer = token && user?.role === "Dealer";
  const isAdmin = token && user?.role === "Admin";
  const canManageCars = isDealer || isAdmin;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Cars</h1>
          <p style={styles.subtitle}>Browse, filter, and manage used cars.</p>
        </div>

        {isDealer && (
          <button style={styles.primaryButton} onClick={() => navigate("/cars/create")}>
            + Create Car
          </button>
        )}
      </div>

      <form onSubmit={handleFilter} style={styles.filterCard}>
        <div style={styles.filterGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Brand</label>
            <select
              name="brandId"
              value={filters.brandId}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Min Price</label>
            <input
              name="minPrice"
              placeholder="e.g. 10000"
              value={filters.minPrice}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Max Price</label>
            <input
              name="maxPrice"
              placeholder="e.g. 30000"
              value={filters.maxPrice}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button type="submit" style={styles.primaryButton}>
            Filter
          </button>
          <button type="button" style={styles.secondaryButton} onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <div style={styles.infoBox}>Loading cars...</div>
      ) : cars.length === 0 ? (
        <div style={styles.infoBox}>No cars found.</div>
      ) : (
        <div style={styles.cardsGrid}>
          {cars.map((car) => (
            <div key={car.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.cardTitle}>{car.title}</h3>
                  <p style={styles.cardMeta}>
                    {car.brand} {car.model}
                  </p>
                </div>

                <div style={styles.priceBadge}>{car.price} €</div>
              </div>

              <div style={styles.specsRow}>
                <span style={styles.specTag}>Year: {car.year}</span>
                <span style={styles.specTag}>Mileage: {car.mileage}</span>
                <span style={styles.specTag}>{car.fuelType}</span>
                <span style={styles.specTag}>{car.transmission}</span>
              </div>

              <div style={styles.cardActions}>
                <Link to={`/cars/${car.id}`} style={styles.linkButton}>
                  View Details
                </Link>

                {canManageCars && (
                  <>
                    <Link to={`/cars/edit/${car.id}`} style={styles.editButton}>
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(car.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "10px 0 30px 0"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  title: {
    margin: 0,
    fontSize: "36px"
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#555"
  },
  filterCard: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  },
  input: {
    height: "40px",
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "16px"
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
  },
  cardsGrid: {
    display: "grid",
    gap: "18px"
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "14px",
    flexWrap: "wrap"
  },
  cardTitle: {
    margin: 0,
    fontSize: "28px"
  },
  cardMeta: {
    margin: "6px 0 0 0",
    color: "#666"
  },
  priceBadge: {
    background: "#ecfdf5",
    color: "#065f46",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    border: "1px solid #a7f3d0"
  },
  specsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "16px"
  },
  specTag: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "14px"
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  linkButton: {
    textDecoration: "none",
    background: "#2563eb",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "600"
  },
  editButton: {
    textDecoration: "none",
    background: "#f59e0b",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "600"
  },
  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }
};