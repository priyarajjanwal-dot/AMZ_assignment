# 🛒 AmazonClone — Project Planning Document

## Project Overview

A full-stack e-commerce web application that closely replicates Amazon's design and UX,  
built with **React.js + Node.js/Express + MongoDB**. The data is seeded with Indian products,  
brands, and pricing (INR) to feel authentic and local.

---

## Tech Stack

| Layer      | Technology                        | Reason                                               |
|------------|-----------------------------------|------------------------------------------------------|
| Frontend   | React.js (Vite, SPA)              | Component model fits product cards / cart patterns   |
| Routing    | React Router v6                   | Client-side navigation between pages                 |
| State      | React Context + useReducer        | Cart & user state; no Redux overhead for this scope  |
| Styling    | Plain CSS Modules + inline styles | Pixel-accurate Amazon clone; no Tailwind lock-in     |
| Backend    | Node.js + Express.js              | Lightweight REST API, easy MongoDB integration       |
| Database   | MongoDB (Mongoose ODM)            | Flexible schema for product variants/specs           |
| HTTP       | Axios                             | Promise-based API calls from React                   |
| Auth (bonus)| JWT + bcrypt                     | Stateless token auth; stored in localStorage         |
| Email (bonus)| Nodemailer + Gmail SMTP          | Order confirmation emails                            |

---

## Folder Structure

```
amazon-clone/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── seed/
│   │   └── seedData.js            # Indian product seed data
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/                # Logos, placeholder images
    │   ├── components/
    │   │   ├── Navbar/
    │   │   ├── ProductCard/
    │   │   ├── ImageCarousel/
    │   │   ├── CartItem/
    │   │   ├── AddressForm/
    │   │   ├── OrderSummary/
    │   │   └── Footer/
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductListPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrderConfirmPage.jsx
    │   │   ├── OrderHistoryPage.jsx   # bonus
    │   │   ├── LoginPage.jsx          # bonus
    │   │   └── SignupPage.jsx         # bonus
    │   ├── context/
    │   │   ├── CartContext.jsx
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js             # Axios base + all API calls
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

---

## Database Schema Design

### 1. Product
```js
{
  _id: ObjectId,
  name: String,                 // "boAt Rockerz 450 Bluetooth Headphones"
  slug: String,                 // url-friendly unique key
  brand: String,                // "boAt"
  category: String,             // "Electronics"
  subCategory: String,          // "Headphones"
  description: String,          // long markdown-style description
  specifications: [             // key-value pairs shown in specs table
    { key: String, value: String }
  ],
  images: [String],             // array of image URLs (min 3 per product)
  price: Number,                // MRP in INR
  discountedPrice: Number,      // selling price in INR
  discountPercent: Number,      // calculated field (stored for perf)
  stock: Number,
  rating: Number,               // 1-5
  reviewCount: Number,
  isFeatured: Boolean,
  tags: [String],
  createdAt: Date
}
```

### 2. User
```js
{
  _id: ObjectId,
  name: String,
  email: String,                // unique
  passwordHash: String,
  phone: String,
  addresses: [
    {
      label: String,            // "Home", "Office"
      fullName: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      isDefault: Boolean
    }
  ],
  wishlist: [{ type: ObjectId, ref: 'Product' }],
  createdAt: Date
}
```

### 3. Cart  
> Stored server-side per user; also mirrored in localStorage for guest UX.

```js
{
  _id: ObjectId,
  userId: ObjectId,             // ref: User (default guest userId for no-auth flow)
  items: [
    {
      productId: ObjectId,      // ref: Product
      quantity: Number,
      addedAt: Date
    }
  ],
  updatedAt: Date
}
```

### 4. Order
```js
{
  _id: ObjectId,
  orderId: String,              // "AMZ-2024-XXXXXXXX" human-readable
  userId: ObjectId,
  items: [
    {
      productId: ObjectId,
      name: String,             // snapshot at time of order
      image: String,
      price: Number,
      quantity: Number
    }
  ],
  shippingAddress: {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String
  },
  pricing: {
    subtotal: Number,
    deliveryCharge: Number,     // free above ₹499
    discount: Number,
    total: Number
  },
  paymentMethod: String,        // "COD" | "UPI" | "Card"
  status: String,               // "placed" | "confirmed" | "shipped" | "delivered"
  estimatedDelivery: Date,
  placedAt: Date
}
```

---

## API Endpoints

### Products
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | /api/products                   | List products (query: search, category, sort, page) |
| GET    | /api/products/:id               | Single product detail                |
| GET    | /api/products/categories        | All distinct categories              |
| GET    | /api/products/featured          | Featured/homepage products           |

### Cart
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | /api/cart/:userId               | Get cart                             |
| POST   | /api/cart/add                   | Add item                             |
| PUT    | /api/cart/update                | Update quantity                      |
| DELETE | /api/cart/remove/:productId     | Remove item                          |
| DELETE | /api/cart/clear/:userId         | Clear entire cart                    |

### Orders
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| POST   | /api/orders                     | Place new order                      |
| GET    | /api/orders/:userId             | User's order history                 |
| GET    | /api/orders/detail/:orderId     | Single order detail                  |

### Users (Bonus)
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| POST   | /api/users/register             | Signup                               |
| POST   | /api/users/login                | Login → JWT                          |
| GET    | /api/users/profile/:id          | Profile                              |

---

## Pages & Components

### Pages
| Route                    | Page                  | Key Components                            |
|--------------------------|-----------------------|-------------------------------------------|
| /                        | HomePage              | Navbar, HeroBanner, CategoryRail, ProductGrid |
| /products                | ProductListPage       | Navbar, Filters, ProductGrid, Pagination  |
| /products/:id            | ProductDetailPage     | ImageCarousel, ProductInfo, AddToCart     |
| /cart                    | CartPage              | CartItem, CartSummary                     |
| /checkout                | CheckoutPage          | AddressForm, OrderSummary, PaymentSection |
| /order-confirm/:orderId  | OrderConfirmPage      | ConfirmBanner, OrderDetails               |
| /orders                  | OrderHistoryPage      | OrderCard list (bonus)                    |
| /login                   | LoginPage             | AuthForm (bonus)                          |

---

## UI/UX Replication Notes (Amazon Reference)

- **Navbar**: Dark header (`#131921`), search bar with category dropdown, cart icon with badge
- **Hero Banner**: Auto-sliding carousel with promotional banners (INR deals)
- **Category Rail**: Horizontally scrollable pill buttons
- **Product Card**: White card, product image (square), ratings stars, price in bold, strike-through MRP, discount badge
- **Product Detail**: Left = image carousel, Right = price/CTA sticky panel. Specs below in table.
- **Cart**: Left-heavy layout, items listed with thumbnail + controls, right panel = order summary sticky
- **Checkout**: Step-based or single long-scroll form. Address → Payment → Review
- **Footer**: Multi-column dark footer with links

---

## Seed Data Categories (Indian Products)

1. **Electronics** — Smartphones, Headphones, Smartwatches, Earbuds
2. **Books** — Hindi & English fiction, UPSC prep books, self-help
3. **Clothing** — Kurtas, Sarees, Men's formals, Ethnic wear
4. **Kitchen & Home** — Pressure cookers, Tiffin boxes, Spice racks
5. **Sports & Fitness** — Cricket bats, Yoga mats, Dumbbells
6. **Beauty & Personal Care** — Ayurvedic skincare, Hair oils, Mehendi

Brands will include: boAt, Prestige, Wildcraft, Fabindia, SG Cricket, Himalaya, Penguin India, etc.

---

## Default User (No-Login Flow)

A default user document is seeded in MongoDB:
```js
{
  _id: "000000000000000000000001",  // fixed ObjectId
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com"
}
```
All cart and order operations use this ID unless auth is implemented.

---

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/amazonclone
JWT_SECRET=your_jwt_secret_here
DEFAULT_USER_ID=000000000000000000000001
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```