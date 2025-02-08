import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const addToCart = (product) => {
    axios
      .post("http://localhost:3001/cart", product)
      .then(() => alert("Added to the Cart Page"))
      .catch((error) => console.error("Error adding product to cart:", error));
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="product-page">
      <div className="header">
        <h1 className="page-title">ShopKaroo</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/cart")} className="cart-button">
            Cart
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="product-list-container">
        <ul className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id} className="product-item">
                <img
                  src={`http://localhost:3001/${product.image}`}
                  alt={product.title}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">${product.price}</p>
                  <Link to={`/product/${product.id}`} className="cart-button">
                    View
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="cart-add-button">
                    Add to Cart
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="no-products">No products available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
