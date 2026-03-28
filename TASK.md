# ✅ TASKS.md — Amazon Clone Build Checklist

> Work through phases in order. Each task is atomic — one file or one concern at a time.  
> Mark tasks `[x]` as you complete them.

---

## PHASE 0 — Project Setup

### Backend Init
  - [x] `mkdir backend && cd backend && npm init -y`
- [x] Install deps: `express mongoose dotenv cors morgan bcryptjs jsonwebtoken nodemailer`
- [x] Install devDeps: `nodemon`
- [x] Create `server.js` — Express app with CORS, JSON middleware, route mounting
- [x] Create `config/db.js` — Mongoose connect function
- [x] Create `.env` file with MONGO_URI, PORT, JWT_SECRET, DEFAULT_USER_ID
- [x] Add `"dev": "nodemon server.js"` to package.json scripts
- [x] Test: `npm run dev` → server running on port 5000

### Frontend Init
- [x] `npm create vite@latest frontend -- --template react`
- [x] Install deps: `axios react-router-dom`
- [x] Clean up `App.jsx`, `index.css`
- [x] Create `src/services/api.js` with Axios base URL from env
- [x] Create `.env` with `VITE_API_BASE_URL`
- [x] Test: `npm run dev` → React app loads on port 5173

---

## PHASE 1 — Database Models & Seed Data

### Models
  - [x] `models/User.js` — Schema with name, email, passwordHash, addresses[], wishlist[]
- [x] `models/Product.js` — Schema with all fields from planning (images[], specs[], etc.)
- [x] `models/Cart.js` — Schema with userId + items[] (productId, quantity)
- [x] `models/Order.js` — Schema with orderId, items snapshot, shippingAddress, pricing, status

### Seed Script
- [x] `seed/seedData.js` — Create and export:
  - [x] 1 default user (Rahul Sharma, fixed ObjectId)
  - [x] 40+ Indian products across 6 categories (see planning for categories)
  - [x] Each product has: 3+ image URLs, real-looking INR pricing, specs, rating
  - [x] Products use Indian brands: boAt, Prestige, SG, Fabindia, Himalaya, Penguin, etc.
  - [x] Names/descriptions written in natural Indian English (not AI-template style)
- [x] Add `"seed": "node seed/seedData.js"` script to package.json
- [x] Test: `npm run seed` → MongoDB populated, check via Compass

---

## PHASE 2 — Backend API

### Product Routes
- [x] `controllers/productController.js`
  - [x] `getAllProducts` — with query params: search, category, sort (price-asc/desc, rating), page, limit
  - [x] `getProductById` — populate full document
  - [x] `getCategories` — distinct categories list
  - [x] `getFeaturedProducts` — isFeatured: true, limit 10
- [x] `routes/productRoutes.js` — wire up GET routes
- [x] Mount at `/api/products` in server.js
- [x] Test all 4 endpoints with Postman/Thunder Client

### Cart Routes
- [x] `controllers/cartController.js`
  - [x] `getCart` — find or create cart by userId, populate product details
  - [x] `addToCart` — upsert item; if exists increment qty, else push
  - [x] `updateCartItem` — set quantity by productId
  - [x] `removeCartItem` — pull item by productId
  - [x] `clearCart` — set items to []
- [x] `routes/cartRoutes.js` — wire up all 5 routes
- [x] Mount at `/api/cart` in server.js
- [x] Test all endpoints

### Order Routes
- [x] `controllers/orderController.js`
  - [x] `placeOrder` — create order, generate orderId (`AMZ-${Date.now()}`), clear cart after
  - [x] `getUserOrders` — list by userId, sorted by placedAt desc
  - [x] `getOrderById` — single order detail
- [x] `routes/orderRoutes.js`
- [x] Mount at `/api/orders` in server.js
- [x] Test order placement → cart cleared → order retrievable

### User Routes (Bonus)
- [x] `controllers/userController.js`
  - [x] `register` — hash password, create user, return JWT
  - [x] `login` — verify password, return JWT
  - [x] `getProfile` — return user (no passwordHash)
- [x] `routes/userRoutes.js`
- [x] `middleware/authMiddleware.js` — verify JWT, attach user to req
- [x] Mount at `/api/users`

### Error Handling
- [x] `middleware/errorHandler.js` — catch-all error middleware
- [x] Wrap all controller logic in try/catch calling next(err)

---

## PHASE 3 — Frontend Foundation

### Routing & Context
- [x] `App.jsx` — set up React Router with all routes (see planning table)
- [x] `context/CartContext.jsx` — state: items[], loading; actions: addItem, removeItem, updateQty, clearCart, fetchCart
- [x] `context/AuthContext.jsx` — state: user; actions: login, logout (uses DEFAULT_USER_ID for no-auth flow)
- [x] Wrap App in both providers in `main.jsx`

### API Service Layer
- [x] `services/api.js`
  - [x] `productAPI.getAll(params)`
  - [x] `productAPI.getById(id)`
  - [x] `productAPI.getCategories()`
  - [x] `productAPI.getFeatured()`
  - [x] `cartAPI.getCart(userId)`
  - [x] `cartAPI.addItem(userId, productId, qty)`
  - [x] `cartAPI.updateItem(userId, productId, qty)`
  - [x] `cartAPI.removeItem(userId, productId)`
  - [x] `orderAPI.place(orderData)`
  - [x] `orderAPI.getUserOrders(userId)`
  - [x] `orderAPI.getById(orderId)`

---

## PHASE 4 — Components

### Navbar
- [x] Logo (Amazon-style) on left
- [x] Search bar with category dropdown (center, wide)
- [x] Cart icon with live item count badge (right)
- [x] "Hello, Rahul" user greeting
- [x] Dark background `#131921`, yellow hover accents
- [x] Mobile: hamburger menu

### Footer
- [x] Multi-column dark footer (Back to top strip + link columns + bottom bar)
- [x] Columns: Get to Know Us, Make Money with Us, Payment Products, Help
- [x] Bottom bar: language/country selector + copyright

### ProductCard
- [x] Product image (square, object-fit: contain on white bg)
- [x] Product name (2-line clamp)
- [x] Star rating (filled/half/empty SVG stars) + review count
- [x] Discounted price bold + MRP strikethrough + discount % badge
- [x] "Add to Cart" button — Amazon yellow `#FFD814`
- [x] Click → navigates to ProductDetail

### ImageCarousel (for ProductDetail)
- [x] Thumbnail strip on left (vertical)
- [x] Large image on right
- [x] Click thumbnail → swap main image
- [x] Keyboard accessible

### StarRating (shared)
- [x] Props: rating (float), size
- [x] Renders filled/partial stars in Amazon orange

### CategoryFilter
- [x] Sidebar checkboxes (ProductList page)
- [x] Horizontal pills (HomePage)

---

## PHASE 5 — Pages

### HomePage (`/`)
- [x] Hero banner carousel (placeholder image ok)
- [x] Category quick-nav grid (3 cards: Electronics, Books, Fashion)
- [x] "Featured Products" horizontal scroll rail
- [x] "Deals of the Day" grid section
- [x] Footer

### ProductListPage (`/products`)
- [x] Reads `?category=x` and `?search=y` from URL
- [x] Left sidebar: category filters + price range
- [x] Top bar: "X results" + sort dropdown
- [x] Product grid
- [x] Pagination (page numbers)
- [x] URL query params update on filter/sort/search

### ProductDetailPage (`/products/:id`)
- [x] Left: ImageCarousel
- [x] Center: Title, Rating, description, specs
- [x] Right: Sticky "Buy Box" (Price, Delivery date, In Stock, Qty dropdown, Add to Cart btn)
- [ ] Below: Product description tab + Specifications table

### CartPage (`/cart`)
- [x] List items with image, title, price, in-stock text
- [x] Qty dropdown (updates backend on change)
- [x] "Delete" link (removes from backend)
- [x] Subtotal block on right side
- [x] "Proceed to Buy" button → goes to `/checkout`
- [ ] Empty cart state with illustration + "Continue Shopping" CTA

### CheckoutPage (`/checkout`)
- [x] Step 1: Delivery Address (show default or hardcoded input)
- [x] Step 2: Payment Method (COD only for now)
- [x] Step 3: Review items
- [x] Order Summary box → `placeOrder` → clear cart → redirect to confirm
- [ ] Right sticky: Order summary throughout all steps

### OrderConfirmPage (`/order-confirm/:orderId`)
- [x] Green checkmark "Order placed, thank you!"
- [x] Delivery estimate
- [x] Link to view order history
- [ ] Items summary
- [ ] "Continue Shopping" + "View Orders" buttons

### OrderHistoryPage (`/orders`) — Bonus
- [ ] List of past orders (card per order)
- [ ] Each card: orderId, date, status badge, item count, total, "View Details" link
- [ ] Click → expand or navigate to order detail

---

## PHASE 6 — Polish & Bonus Features

### Responsive Design
- [x] Navbar collapses to hamburger on mobile
- [x] Product grid: 4→2→1 columns
- [x] Cart: stacks vertically on mobile
- [x] Checkout: single column on mobile

### PHASE 6 — Authentication (Bonus)

### Auth API & Context
- [x] Connect `Login/Signup` pages to `userAPI`
- [x] Update `AuthContext`
- [x] Store JWT in localStorage
- [x] Persist auth state on refresh

### UI
- [x] Replace "Hello, Sign In" with actual user name
- [x] Add "Sign Out" dropdown in Navbar

### Wishlist (Bonus)
- [ ] Heart icon on ProductCard
- [ ] POST /api/users/wishlist/add, DELETE /api/users/wishlist/remove
- [ ] WishlistPage at `/wishlist`

### Email Notification (Bonus)
- [ ] On order placement, backend sends confirmation email via Nodemailer
- [ ] Email includes: order ID, items list, total, estimated delivery

---

## PHASE 7 — README & Final Touches

- [ ] `README.md` at project root:
  - [ ] Project description + screenshots
  - [ ] Tech stack table
  - [ ] Prerequisites (Node, MongoDB, npm versions)
  - [ ] Setup steps: clone → install → env → seed → run
  - [ ] API documentation (brief)
  - [ ] Assumptions & design decisions
  - [ ] Folder structure overview
- [ ] Test full user flow: Browse → Search → Filter → Product Detail → Add to Cart → Checkout → Order Confirm
- [ ] Test edge cases: empty cart, out-of-stock, invalid pincode
- [ ] Final code cleanup: remove console.logs, unused imports

---

## Build Order Summary

```
Phase 0  →  Repo & tooling setup
Phase 1  →  DB models + Indian seed data        ← START HERE after planning
Phase 2  →  All backend REST APIs
Phase 3  →  Frontend routing + context + API service
Phase 4  →  Shared components
Phase 5  →  All pages
Phase 6  →  Polish + bonus features
Phase 7  →  README + final testing
```

> **Next immediate step**: Write the seed data file (`backend/seed/seedData.js`)  
> with 40+ authentic Indian products. This is Phase 1, Task 2.