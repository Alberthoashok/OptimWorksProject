import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("user");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const correctPassword =
      role === "vendor"
        ? `${credentials.username}123`
        : `${credentials.username}456`;

    if (credentials.password === correctPassword) {
      localStorage.setItem("role", role);
      navigate(role === "vendor" ? "/venderProducts" : "/products");
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <select
          className="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
