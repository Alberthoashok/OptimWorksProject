import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/cart")
      .then((response) => setCartItems(response.data))
      .catch((error) => console.error("Error fetching cart items:", error));
  }, []);

  const deleteFromCart = (id) => {
    axios
      .delete(`http://localhost:3001/cart/${id}`)
      .then(() => setCartItems(cartItems.filter((item) => item.id !== id)))
      .catch((error) => console.error("Error deleting cart item:", error));
  };

  const buyNow = (item) => {
    axios
      .post("http://localhost:3001/orders", item)
      .then(() => axios.delete(`http://localhost:3001/cart/${item.id}`))
      .then(() => {
        alert("Item purchased successfully!");
        setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
        navigate("/orders");
      })
      .catch((error) => console.error("Error purchasing item:", error));
  };

  return (
    <div className="cart-page">
      <button className="back-button" onClick={() => navigate("/productslist")}>
        ← Back
      </button>

      <h2 className="cart-title">🛒 Your Cart</h2>
      <ul className="cart-list">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img
                className="cart-item-image"
                src={`http://localhost:3001/${item.image}`}
                alt={item.title}
              />
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                <div className="cart-item-buttons">
                  <button
                    className="cart-button remove"
                    onClick={() => deleteFromCart(item.id)}>
                    Remove
                  </button>
                  <button
                    className="cart-button buy"
                    onClick={() => buyNow(item)}>
                    Buy Now
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="cart-empty">No items in cart.</p>
        )}
      </ul>
    </div>
  );
};

export default Cart;
