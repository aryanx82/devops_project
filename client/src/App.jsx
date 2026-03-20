import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  return <div className="toast">{message}</div>
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="loader">
      <span /><span /><span />
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img
        className="product-img"
        src={product.image}
        alt={product.name}
        loading="lazy"
      />
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <p className="product-name">{product.name}</p>
        <div className="product-row">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <span className="product-rating">★ {product.rating}</span>
        </div>
        <button className="add-btn" onClick={() => onAddToCart(product.id)}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onRemove, onClear }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Shopping cart">
        <div className="drawer-header">
          <h2>🛒 Your Cart ({cart.count || 0})</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer-body">
          {cart.items && cart.items.length > 0 ? (
            cart.items.map(item => (
              <div className="cart-item" key={item.id}>
                <img className="cart-item-img" src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">
                    ₹{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <button className="remove-btn" onClick={() => onRemove(item.id)} aria-label="Remove item">✕</button>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <div className="icon">🛍️</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
                Add some items to get started
              </p>
            </div>
          )}
        </div>

        {cart.items && cart.items.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span>Total</span>
              <span className="total-price">₹{(cart.total || 0).toLocaleString()}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout →</button>
            <button className="clear-btn" onClick={onClear}>Clear Cart</button>
          </div>
        )}
      </aside>
    </>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart]             = useState({ items: [], total: 0, count: 0 })
  const [activeCategory, setActive] = useState('All')
  const [cartOpen, setCartOpen]     = useState(false)
  const [loading, setLoading]       = useState(true)
  const [apiStatus, setApiStatus]   = useState('checking')
  const [toast, setToast]           = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2100)
  }

  // Fetch products (with optional category filter)
  const fetchProducts = useCallback(async (category) => {
    setLoading(true)
    try {
      const url = category && category !== 'All'
        ? `${API}/api/products?category=${encodeURIComponent(category)}`
        : `${API}/api/products`
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/categories`)
      const data = await res.json()
      setCategories(['All', ...(data.categories || [])])
    } catch {
      setCategories(['All'])
    }
  }, [])

  // Fetch cart
  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/cart`)
      const data = await res.json()
      setCart(data)
    } catch {
      /* cart fetch fail is silent */
    }
  }, [])

  // Check API health
  useEffect(() => {
    fetch(`${API}/api/health`)
      .then(r => r.json())
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'))
  }, [])

  // Initial load
  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchCart()
  }, [fetchProducts, fetchCategories, fetchCart])

  // Category filter
  const handleCategory = (cat) => {
    setActive(cat)
    fetchProducts(cat === 'All' ? null : cat)
  }

  // Add to cart
  const handleAddToCart = async (productId) => {
    try {
      await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      await fetchCart()
      showToast('✓ Added to cart')
    } catch {
      showToast('Failed to add item')
    }
  }

  // Remove from cart
  const handleRemove = async (productId) => {
    try {
      await fetch(`${API}/api/cart/${productId}`, { method: 'DELETE' })
      await fetchCart()
    } catch { /* silent */ }
  }

  // Clear cart
  const handleClear = async () => {
    try {
      await fetch(`${API}/api/cart`, { method: 'DELETE' })
      await fetchCart()
    } catch { /* silent */ }
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-brand">ShopSmart ✦</span>
        <div className="navbar-right">
          <button className="cart-btn" id="open-cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart
            {cart.count > 0 && <span className="cart-badge">{cart.count}</span>}
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="main">

        {/* API Status */}
        <div className="status-bar">
          <div className={`status-dot ${apiStatus === 'offline' ? 'offline' : ''}`} />
          <span>API {apiStatus === 'checking' ? 'connecting…' : apiStatus}</span>
        </div>

        {/* Hero */}
        <section className="hero">
          <h1>Shop <span>Smarter</span>,<br />Live Better</h1>
          <p>Discover curated products across every category — all in one place.</p>
        </section>

        {/* Category filters */}
        <div className="filters" role="group" aria-label="Category filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <Loader />
        ) : (
          <div className="products-grid" id="products-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

      </main>

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemove}
          onClear={handleClear}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} />}
    </>
  )
}
