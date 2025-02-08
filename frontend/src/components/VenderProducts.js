import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./VenderProductList.css";
const VenderProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const deleteProduct = (id) => {
    axios
      .delete(`http://localhost:3001/products/${id}`)
      .then(() => setProducts(products.filter((product) => product.id !== id)))
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="vendor-products-container">
      <div className="vendor-header-actions">
        <Link to="/add">
          <button className="vendor-add-button">Add Product</button>
        </Link>
        <Link to="/orders">
          <button className="vendor-add-button check">Checkout Orders</button>
        </Link>
        <button onClick={handleLogout} className="vendor-logout-button">
          Logout
        </button>
      </div>

      <div className="product-list-wrapper">
        <h2 className="product-list-title">Products</h2>
        <ul className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id} className="product-card">
                <img
                  src={`http://localhost:3001/${product.image}`}
                  alt={product.title}
                  className="product-image"
                />
                <div className="product-details">
                  <h3 className="product-name">{product.title}</h3>
                  <p className="product-price">${product.price}</p>
                </div>
                <div className="product-actions">
                  <Link
                    to={`/product/${product.id}`}
                    className="action-btn view-btn">
                    View
                  </Link>
                  <Link
                    to={`/edit/${product.id}`}
                    className="action-btn edit-btn">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="action-btn delete-btn">
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="no-products-msg">No products available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VenderProducts;
