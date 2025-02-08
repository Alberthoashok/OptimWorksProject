import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [id]);

  return product ? (
    <div className="product-detail-container">
      <div className="product-card">
        <img
          src={`http://localhost:3001/${product.image}`}
          alt={product.title}
          className="product-image"
        />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price}</p>
          <p className="product-category">Category: {product.category}</p>
        </div>
      </div>
    </div>
  ) : (
    <p className="loading-message">Loading product details...</p>
  );
};

export default ProductDetails;
