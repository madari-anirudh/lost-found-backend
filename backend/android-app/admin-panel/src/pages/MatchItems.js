import React, { useEffect, useState } from "react";
import API from "../api/api";
import axios from "axios";
import "./MatchItems.css";

function MatchItems() {

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  const [selectedLost, setSelectedLost] = useState("");
  const [selectedFound, setSelectedFound] = useState("");

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchLost();
    fetchFound();
  }, []);

  const fetchLost = async () => {
  try {
    const res = await API.get("/admin/lost-items?status=searching");
    setLostItems(res.data);
  } catch (err) {
    console.log(err);
    alert("Failed to load lost items");
  }
};

const fetchFound = async () => {
  try {
    const res = await API.get("/admin/found-items?status=searching");
    setFoundItems(res.data);
  } catch (err) {
    console.log(err);
    alert("Failed to load found items");
  }
};

  const matchItems = async () => {

    if (!selectedLost || !selectedFound) {
      alert("Select both items");
      return;
    }

    try {
      setLoading(true);

      await API.post("/admin/match", {
        lostItemId: selectedLost,
        foundItemId: selectedFound
      });

      alert("✅ Items matched successfully");

      setSelectedLost("");
      setSelectedFound("");

      fetchLost();
      fetchFound();

    } catch (err) {
      alert("❌ Match failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="match-page">

      <h1 className="title">Match Lost & Found</h1>

      <div className="columns">

        {/* LOST ITEMS */}
        <div className="column">
          <h2>Lost Items</h2>

          {lostItems.map(item => (
            <div
              key={item._id}
              className={`card ${selectedLost === item._id ? "active" : ""}`}
              onClick={() => setSelectedLost(item._id)}
            >
              <h3>{item.title}</h3>
              <p>📍 {item.location}</p>
              <p>📞 {item.phone}</p>

              <button onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(item.image);
              }}>
                View Image
              </button>
            </div>
          ))}

        </div>

        {/* FOUND ITEMS */}
        <div className="column">
          <h2>Found Items</h2>

          {foundItems.map(item => (
            <div
              key={item._id}
              className={`card ${selectedFound === item._id ? "active" : ""}`}
              onClick={() => setSelectedFound(item._id)}
            >
              <h3>{item.title}</h3>
              <p>📍 {item.location}</p>
              <p>📞 {item.phone}</p>

              <button onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(item.image);
              }}>
                View Image
              </button>
            </div>
          ))}

        </div>

      </div>

      {/* MATCH BUTTON */}
      <div className="match-btn-container">
        <button
          onClick={matchItems}
          disabled={loading}
          className="match-btn"
        >
          {loading ? "Matching..." : " MATCH ITEM"}
        </button>
      </div>

      {/* IMAGE MODAL */}
      {previewImage && (
        <div className="modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="preview" />
        </div>
      )}

    </div>
  );
}

export default MatchItems;