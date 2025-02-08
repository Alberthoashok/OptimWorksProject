import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductForm.css"; 

const ProductForm = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(product).forEach((key) => formData.append(key, product[key]));

    await axios.post("http://localhost:3001/products", formData);
    navigate("/venderProducts");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
          className="form-input"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="form-textarea"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="file"
          onChange={handleFileChange}
          required
          className="form-file-input"
        />
        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
