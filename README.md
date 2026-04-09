# 🍽️ FoodieHub — Restaurant Menu & Order App

> A full-stack restaurant ordering platform with role-based access, real-time order tracking, revenue analytics, and an AI-powered menu description generator.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Redux Slices](#-redux-slices)
- [AI Feature](#-ai-feature)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🌟 Overview

FoodieHub is a production-grade restaurant ordering application built for two roles:

- **Admin (Restaurant Owner)** — Manages the full menu, tracks all orders, updates order statuses, and views revenue analytics.
- **User (Customer)** — Browses the menu by category, adds items to a cart, places orders, and tracks order status in real time.

---

## ✨ Features

### 👨‍💼 Admin
- Add, edit, and delete menu items and categories
- View all customer orders and update their status
- Order lifecycle: `Pending → Preparing → Ready → Delivered`
- Revenue dashboard with daily earnings chart
- Popular items analytics via MongoDB aggregation
- **AI-powered menu description generator** using Claude API

### 👤 User
- Browse menu filtered by category
- Add items to cart, adjust quantities, remove items
- Place an order and receive a unique Order ID
- Real-time order status tracking (polls every 10 seconds)
- View past order history

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| State Management | Redux Toolkit |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| AI Feature | Anthropic Claude API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
foodiehub/
├── client/                          # React + Vite frontend
│   └── src/
│       ├── app/
│       │   └── store.js             # Redux store
│       ├── features/
│       │   ├── auth/                # authSlice + Login/Register pages
│       │   ├── cart/                # cartSlice + CartDrawer
│       │   ├── menu/                # Menu grid, admin form, category filter
│       │   └── orders/              # orderSlice + tracking + admin table
│       ├── components/              # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Button.jsx
│       │   ├── Badge.jsx
│       │   ├── Modal.jsx
│       │   ├── Spinner.jsx
│       │   ├── StatusDropdown.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/                   # Route-level pages
│       ├── hooks/                   # useAuth, useCart
│       └── utils/                   # axiosInstance, formatCurrency
│
└── server/                          # Node.js + Express backend
    ├── config/db.js
    ├── models/                      # User, MenuItem, Order schemas
    ├── middleware/                   # authMiddleware, adminMiddleware
    ├── controllers/                  # auth, menu, order, revenue
    └── routes/                       # authRoutes, menuRoutes, orderRoutes, revenueRoutes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/foodiehub.git
cd foodiehub
```

### 2. Setup the Backend

```bash
cd server
npm install
cp .env.example .env     # Fill in your values (see below)
npm run dev              # Starts with nodemon
```

### 3. Setup the Frontend

```bash
cd client
npm install
cp .env.example .env     # Fill in your values (see below)
npm run dev              # Starts Vite dev server
```

### 4. Open in browser

```
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

---

## 🔐 Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/foodiehub
JWT_SECRET=your_super_secret_jwt_key
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files.** Both are listed in `.gitignore`.

---

## 📡 API Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Menu

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/menu` | Public | Fetch all menu items |
| POST | `/api/menu` | Admin | Add a new menu item |
| PUT | `/api/menu/:id` | Admin | Update a menu item |
| DELETE | `/api/menu/:id` | Admin | Delete a menu item |

### Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | User | Place a new order |
| GET | `/api/orders/mine` | User | Get current user's orders |
| GET | `/api/orders` | Admin | Get all orders |
| GET | `/api/orders/:id` | User/Admin | Get a specific order |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

### Revenue (Admin)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/revenue` | Admin | Daily revenue + popular items via MongoDB aggregation |

### AI (Admin)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/admin/generate-description` | Admin | Generate menu description using Claude API |

---

## 🗃️ Redux Slices

### `authSlice`
```js
{
  user: { id, name, email, role } | null,
  token: string | null,
  loading: boolean,
  error: string | null
}
// Thunks: loginUser, registerUser
// Actions: setCredentials, logout
```

### `cartSlice`
```js
{
  items: [{ _id, name, price, image, quantity }],
  totalItems: number,
  totalPrice: number
}
// Actions: addItem, removeItem, updateQuantity, clearCart
```

### `orderSlice`
```js
{
  currentOrder: Order | null,
  myOrders: Order[],
  allOrders: Order[],
  loading: boolean,
  error: string | null
}
// Thunks: placeOrder, fetchMyOrders, fetchAllOrders, updateOrderStatus
```

---

## 🤖 AI Feature

When an Admin adds a new menu item, they can click **"Generate Description"** to auto-fill the description field using Claude AI.

**How it works:**
1. Admin enters the dish name and selects a category
2. Clicks "Generate Description"
3. The backend calls Claude API with the prompt:
   > *"Write a mouth-watering 2-sentence menu description for a dish called [name] in the [category] category."*
4. The generated description is returned and auto-filled into the form

The API key is kept **server-side only** — the client calls your own backend endpoint `/api/admin/generate-description`, which proxies to Anthropic.

---

## 📦 MongoDB Aggregation

The revenue dashboard uses MongoDB aggregation pipelines:

```js
// Daily Revenue
Order.aggregate([
  { $match: { status: 'Delivered' } },
  { $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      revenue: { $sum: "$totalPrice" },
      orders: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
])

// Popular Items (Top 5)
Order.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.menuItemId", totalSold: { $sum: "$items.quantity" } } },
  { $sort: { totalSold: -1 } },
  { $limit: 5 },
  { $lookup: { from: "menuitems", localField: "_id", foreignField: "_id", as: "item" } }
])
```

---

## 🌐 Deployment

### Backend → Render

1. Push `server/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `server/.env`

### Frontend → Vercel

1. Push `client/` to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set framework preset to **Vite**
4. Add environment variable: `VITE_API_URL=https://your-render-backend.onrender.com/api`
5. Deploy

---

## 🗓️ Build Timeline

| Week | Dates | Milestone |
|------|-------|-----------|
| Week 1 | 26 Mar – 1 Apr | React + Redux setup · Schemas · Auth API · Menu CRUD |
| Week 2 | 2 Apr – 8 Apr | Order API · Revenue aggregation · cartSlice · Role middleware |
| Week 3 | 9 Apr – 15 Apr | Admin UI · User Menu + Cart · Order tracking |
| Week 4 | 16 Apr – 22 Apr | Claude AI feature · UI polish · Bug fixes |
| Final | 23 Apr – 25 Apr | Deploy · Final testing · Submission |

---

## ✅ Submission Checklist

- [x] Register and Login working for Admin and User
- [x] Admin can add, edit, delete menu items and categories
- [x] Admin can view all orders and update status
- [x] User can browse, filter, add to cart, place and track orders
- [x] JWT required on all protected routes
- [x] MongoDB aggregation used for revenue analytics
- [x] Redux Toolkit slices manage all application state
- [x] Minimum 4 reusable components built and used across pages
- [x] Claude AI description generator is functional
- [x] Backend deployed on Render, Frontend deployed on Vercel

---

## 🧑‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ as part of a full-stack development project — FoodieHub © 2026
