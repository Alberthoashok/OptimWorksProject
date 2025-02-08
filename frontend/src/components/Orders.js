import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleBack = () => {
    const role = localStorage.getItem("role");
    if (role === "vendor") {
      navigate("/venderProducts");
    } else {
      navigate("/cart");
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
      <ul className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.id} className="order-item">
              <img
                src={`http://localhost:3001/${order.image}`}
                alt={order.title}
                className="order-image"
              />
              <div className="order-details">
                <h3 className="order-title">{order.title}</h3>
                <p className="order-price">${order.price}</p>
              </div>
            </li>
          ))
        ) : (
          <p className="no-orders-message">No orders placed yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Orders;
