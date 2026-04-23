import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isDealer = token && user?.role === "Dealer";
  const isBuyer = token && user?.role === "Buyer";
  const isAdmin = token && user?.role === "Admin";

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/cars" style={styles.link}>Cars</Link>

        {!token && (
          <>
            <Link to="/" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {isDealer && (
          <Link to="/cars/create" style={styles.link}>Create Car</Link>
        )}

        {isBuyer && (
          <span style={styles.roleHint}>Buyer Mode</span>
        )}

        {isAdmin && (
          <span style={styles.roleHint}>Admin Mode</span>
        )}
      </div>

      <div style={styles.right}>
        {token ? (
          <>
            <span style={styles.userInfo}>
              {user?.fullName} ({user?.role})
            </span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <span style={styles.guestText}>Guest</span>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "14px 20px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
  },
  left: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  right: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  link: {
    textDecoration: "none",
    color: "#111827",
    fontWeight: "600"
  },
  userInfo: {
    color: "#374151",
    fontWeight: "600"
  },
  logoutButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer"
  },
  roleHint: {
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    color: "#374151"
  },
  guestText: {
    color: "#6b7280"
  }
};