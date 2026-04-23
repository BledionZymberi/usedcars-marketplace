import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CarDetailsPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCar();
  }, [id]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cars/${id}`);
      setCar(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isDealer = token && user?.role === "Dealer";

  if (loading) return <div style={styles.infoBox}>Loading...</div>;
  if (!car) return <div style={styles.infoBox}>Car not found.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <div>
            <h1 style={styles.title}>{car.title}</h1>
            <p style={styles.subtitle}>
              {car.brand} {car.model}
            </p>
          </div>

          <div style={styles.priceBadge}>{car.price} €</div>
        </div>

        <div style={styles.specsGrid}>
          <div style={styles.specItem}><strong>Year:</strong> {car.year}</div>
          <div style={styles.specItem}><strong>Mileage:</strong> {car.mileage}</div>
          <div style={styles.specItem}><strong>Fuel Type:</strong> {car.fuelType}</div>
          <div style={styles.specItem}><strong>Transmission:</strong> {car.transmission}</div>
        </div>

        <div style={styles.descriptionBox}>
          <h3>Description</h3>
          <p style={{ margin: 0 }}>{car.description}</p>
        </div>

        <div style={styles.actions}>
          <Link to="/cars" style={styles.secondaryButton}>Back to Cars</Link>

          {isDealer && (
            <Link to={`/cars/edit/${car.id}`} style={styles.primaryButton}>
              Edit Car
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "10px 0 30px 0"
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  title: {
    margin: 0,
    fontSize: "34px"
  },
  subtitle: {
    marginTop: "6px",
    color: "#666"
  },
  priceBadge: {
    background: "#ecfdf5",
    color: "#065f46",
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid #a7f3d0",
    fontWeight: "700",
    height: "fit-content"
  },
  specsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "20px"
  },
  specItem: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px"
  },
  descriptionBox: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "20px"
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  primaryButton: {
    textDecoration: "none",
    background: "#111827",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "600"
  },
  secondaryButton: {
    textDecoration: "none",
    background: "#f3f4f6",
    color: "#111827",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontWeight: "600"
  },
  infoBox: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px"
  }
};