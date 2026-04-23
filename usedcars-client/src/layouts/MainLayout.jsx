import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}