import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CarsPage from "../pages/CarsPage";
import CarDetailsPage from "../pages/CarDetailsPage";
import CreateCarPage from "../pages/CreateCarPage";
import EditCarPage from "../pages/EditCarPage";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />

          <Route
            path="/cars/create"
            element={
              <ProtectedRoute roles={["Dealer"]}>
                <CreateCarPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cars/edit/:id"
            element={
              <ProtectedRoute roles={["Dealer"]}>
                <EditCarPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}