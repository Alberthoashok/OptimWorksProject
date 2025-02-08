const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const app = express();
const port = 3001;
const dbPath = path.join(__dirname, "database.db");
let db = null;

app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

// Setup Multer for Image Uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Connect to Database and Initialize FakeStore Products
const connect = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    console.log("Connected to SQLite database.");

    // Create products table if not exists
    await db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL
      )
    `);

    // Create cart table if not exists
    await db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL
      )
    `);

    // Check if products table is empty
    const count = await db.get("SELECT COUNT(*) as count FROM products");
    if (count.count === 0) {
      console.log("Fetching FakeStoreAPI products...");
      const response = await axios.get("https://fakestoreapi.com/products");
      const products = response.data;

      // Insert FakeStoreAPI products into SQLite
      const insertQuery = `INSERT INTO products (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)`;

      for (const product of products) {
        await db.run(insertQuery, [
          product.title,
          product.description,
          product.price,
          product.category,
          product.image,
        ]);
      }

      console.log("FakeStoreAPI products added to database.");
    }

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (e) {
    console.log("Error connecting to database:", e.message);
  }
};
connect();

/** ========================== PRODUCTS ENDPOINTS ========================== **/

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await db.all("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await db.get(
      "SELECT * FROM products WHERE id = ?",
      req.params.id
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product
app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.filename : "";

    const result = await db.run(
      "INSERT INTO products (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)",
      title,
      description,
      price,
      category,
      image
    );
    res.json({ id: result.lastID, title, description, price, category, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product
app.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.filename : req.body.image;

    await db.run(
      "UPDATE products SET title = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?",
      title,
      description,
      price,
      category,
      image,
      req.params.id
    );
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    await db.run("DELETE FROM products WHERE id = ?", req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ========================== CART ENDPOINTS ========================== **/

// Get all cart items
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await db.all("SELECT * FROM cart");
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single cart item by ID
app.get("/cart/:id", async (req, res) => {
  try {
    const cartItem = await db.get(
      "SELECT * FROM cart WHERE id = ?",
      req.params.id
    );
    if (!cartItem)
      return res.status(404).json({ error: "Cart item not found" });
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a product to the cart
app.post("/cart", async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;

    const result = await db.run(
      "INSERT INTO cart (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)",
      title,
      description,
      price,
      category,
      image
    );
    res.json({ id: result.lastID, title, description, price, category, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a cart item
app.put("/cart/:id", async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;

    await db.run(
      "UPDATE cart SET title = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?",
      title,
      description,
      price,
      category,
      image,
      req.params.id
    );
    res.json({ message: "Cart item updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a cart item
app.delete("/cart/:id", async (req, res) => {
  try {
    await db.run("DELETE FROM cart WHERE id = ?", req.params.id);
    res.json({ message: "Cart item removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear the cart
app.delete("/cart", async (req, res) => {
  try {
    await db.run("DELETE FROM cart");
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await db.all("SELECT * FROM orders");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const order = await db.get(
      "SELECT * FROM orders WHERE id = ?",
      req.params.id
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new order
app.post("/orders", async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;

    const result = await db.run(
      "INSERT INTO orders (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)",
      title,
      description,
      price,
      category,
      image
    );
    res.json({ id: result.lastID, title, description, price, category, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an order
app.put("/orders/:id", async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;
    await db.run(
      "UPDATE orders SET title = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?",
      title,
      description,
      price,
      category,
      image,
      req.params.id
    );
    res.json({ message: "Order updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order
app.delete("/orders/:id", async (req, res) => {
  try {
    await db.run("DELETE FROM orders WHERE id = ?", req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
