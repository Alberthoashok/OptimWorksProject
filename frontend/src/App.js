import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import ProductDetails from "./components/ProductDetails";
import EditProduct from "./components/EditProduct";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Login from "./components/Login";
import VenderProducts from "./components/VenderProducts";
const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add" element={<ProductForm />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/venderProducts" element={<VenderProducts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
