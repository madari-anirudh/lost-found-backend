import React, { useState } from "react";
import API from "../api/api";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const login = async () => {
    try {
      const res = await API.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      window.location = "/dashboard";
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="login-container">

      {/* 🌈 BACKGROUND GLOW */}
      <div className="glow-orb orb1"></div>
      <div className="glow-orb orb2"></div>

      {/* 🧊 MAIN CONTENT */}
      <div className="content">
        <h1 className="title">Lost & Found</h1>
        <p className="subtitle">
          Smart system to manage lost & found items with precision and speed.
        </p>

        <button className="admin-btn" onClick={() => setShowModal(true)}>
          ADMIN PANEL
        </button>
      </div>

      {/* 🔐 MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="modal-title">Admin Login</h2>

            <input
              className="input"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" onClick={login}>
              Login
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Login;