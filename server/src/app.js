const express = require('express');
const cors = require('cors');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── In-memory data ───────────────────────────────────────────────────────────

const products = [
  { id: 1, name: 'Wireless Headphones', price: 2499, category: 'Electronics', rating: 4.5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
  { id: 2, name: 'Running Shoes', price: 1899, category: 'Fashion', rating: 4.2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  { id: 3, name: 'Coffee Maker', price: 3299, category: 'Kitchen', rating: 4.7, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop' },
  { id: 4, name: 'Yoga Mat', price: 799, category: 'Sports', rating: 4.4, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop' },
  { id: 5, name: 'Backpack', price: 1299, category: 'Fashion', rating: 4.3, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop' },
  { id: 6, name: 'Smart Watch', price: 4999, category: 'Electronics', rating: 4.6, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' },
  { id: 7, name: 'Desk Lamp', price: 599, category: 'Home', rating: 4.1, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop' },
  { id: 8, name: 'Water Bottle', price: 399, category: 'Sports', rating: 4.8, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop' },
];

// In-memory cart: { productId: quantity }
let cart = {};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShopSmart Backend is running', timestamp: new Date().toISOString() });
});

// GET all products (with optional category filter)
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const result = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;
  res.json({ products: result, total: result.length });
});

// GET single product by id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// GET all unique categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ categories });
});

// GET cart (with full product info)
app.get('/api/cart', (req, res) => {
  const items = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === parseInt(id));
    return product ? { ...product, quantity: qty } : null;
  }).filter(Boolean);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items, total, count: items.reduce((s, i) => s + i.quantity, 0) });
});

// POST add item to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required' });

  const product = products.find(p => p.id === parseInt(productId));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  cart[productId] = (cart[productId] || 0) + quantity;
  res.json({ message: 'Added to cart', productId, quantity: cart[productId] });
});

// DELETE remove item from cart
app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  if (!cart[productId]) return res.status(404).json({ error: 'Item not in cart' });
  delete cart[productId];
  res.json({ message: 'Removed from cart', productId });
});

// DELETE clear entire cart
app.delete('/api/cart', (req, res) => {
  cart = {};
  res.json({ message: 'Cart cleared' });
});

// Root
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
