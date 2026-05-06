import React, { useEffect, useState } from "react";
import API from "../api/api";
import "./LostItems.css";

function LostItems() {

  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/api/admin/lost-items");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lost-page">

      <h1 className="title">Lost Items</h1>

      <div className="table-container">

        <table className="glass-table">

          <thead>
            <tr>
              <th>Title</th>
              <th>User</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Description</th>
              <th>Date</th>
              <th>Image</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item._id}>

                <td>{item.title}</td>

                <td>{item.userId?.name || item.userId?.email}</td>

                <td>{item.phone}</td>

                <td>{item.location}</td>

                <td className="desc">{item.description}</td>

                <td>
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="preview" />
        </div>
      )}

    </div>
  );
}

export default LostItems;