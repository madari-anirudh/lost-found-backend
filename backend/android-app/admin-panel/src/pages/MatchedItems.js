import React, { useEffect, useState } from "react";
import API from "../api/api";
import "./MatchedItems.css";

function MatchedItems() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/api/admin/matched-items");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="matched-page">

      <h1 className="title">Solved Cases</h1>

      <div className="table-container">

        <table className="glass-table">

          <thead>
            <tr>
              <th>Lost Item</th>
              <th>Lost User</th>
              <th>Found Item</th>
              <th>Finder Phone</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (

              <tr key={item._id}>

                <td className="highlight">{item.title}</td>

                <td>
                  {item.userId?.name || item.userId?.email}
                </td>

                <td className="highlight2">
                  {item.matchedWith?.title}
                </td>

                <td>{item.matchedWith?.phone}</td>

                <td>
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td>
                  <span className="status success">
                    ✔ Solved
                  </span>
                </td>

              </tr>

            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default MatchedItems;