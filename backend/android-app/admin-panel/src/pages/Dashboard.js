import React from "react";

function Dashboard() {

  return (

    <div style={container}>

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

/*  BACKGROUND */

const container = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  color: "#fff"
};

/*  TITLE */

const title = {
  textAlign: "center",
  marginBottom: "40px",
  fontSize: "28px",
  letterSpacing: "1px"
};

/*  GRID */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "25px"
};

/*  GLASS CARD */

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

/*  HOVER EFFECT (INLINE FIX) */

const style = document.createElement("style");
style.innerHTML = `
a:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5),
              0 0 40px rgba(0, 255, 255, 0.3);
}
`;
document.head.appendChild(style);

export default Dashboard;