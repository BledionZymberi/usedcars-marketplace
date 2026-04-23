import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: 3,
    tenantId: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        roleId: Number(form.roleId),
        tenantId: form.tenantId ? Number(form.tenantId) : null
      });

      alert("Register successful");
      navigate("/");
    } catch (error) {
      alert(error?.response?.data || "Register failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Role</label>
          <select name="roleId" value={form.roleId} onChange={handleChange}>
            <option value={3}>Buyer</option>
            <option value={2}>Dealer</option>
          </select>
        </div>

        <div>
          <input
            name="tenantId"
            placeholder="Tenant ID (required for Dealer)"
            value={form.tenantId}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}