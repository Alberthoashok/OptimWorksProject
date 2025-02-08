import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditProduct.css"; 

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/products/${id}`, product);
      alert("Product updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="edit-product-container">
      <h2 className="edit-product-title">Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label className="form-label">Title:</label>
        <input
          type="text"
          name="title"
          value={product.title || ""}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label className="form-label">Description:</label>
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleChange}
          required
          className="form-textarea"
        />

        <label className="form-label">Price:</label>
        <input
          type="number"
          name="price"
          value={product.price || ""}
          onChange={handleChange}
          required
          className="form-input"
        />

        <button type="submit" className="form-button">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
