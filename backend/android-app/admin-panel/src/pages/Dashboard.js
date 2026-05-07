import React from "react";

function Dashboard() {
  // Mock logout function - replace with your actual logic
  const logout = () => {
    console.log("Logging out...");
    // window.location.href = "/login"; 
  };

  return (
    <div style={container}>
      <button onClick={logout} style={logoutBtn} className="logout-hover">
        Logout
      </button>

      <h2 style={title}>Admin Dashboard</h2>

      <div style={grid}>
        <a href="/lost" style={card}>📦 Lost Items</a>
        <a href="/found" style={card}>🔍 Found Items</a>
        <a href="/match" style={card}>🔗 Match Items</a>
        <a href="/matched" style={card}>✅ Solved Cases</a>
      </div>
    </div>
  );
}

/*  STYLING OBJECTS */

const container = {
  position: "relative", // Required to anchor the logout button
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  color: "#fff",
  fontFamily: "sans-serif"
};

const logoutBtn = {
  position: "absolute",
  top: "30px",
  right: "30px",
  padding: "8px 18px",
  fontSize: "14px",
  color: "#fff",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s",
  fontWeight: "bold"
};

const title = {
  textAlign: "center",
  marginBottom: "60px",
  marginTop: "20px",
  fontSize: "28px",
  letterSpacing: "1px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "25px",
  maxWidth: "1200px",
  margin: "0 auto"
};

const card = {
  textDecoration: "none",
  color: "#fff",
  padding: "30px",
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  textAlign: "center",
  fontSize: "18px",
  transition: "0.3s",
};

/*  HOVER EFFECTS */

const style = document.createElement("style");
style.innerHTML = `
  a:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }

  .logout-hover:hover {
    background: rgba(255, 75, 75, 0.3) !important;
    border-color: rgba(255, 100, 100, 0.5) !important;
    transform: scale(1.05);
  }
`;
document.head.appendChild(style);

export default Dashboard;