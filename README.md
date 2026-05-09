# 🍗 Chicken Shop - E-Commerce Platform

A comprehensive, role-based e-commerce platform built for managing a modern chicken shop. This application provides a seamless experience for clients to browse and order, while empowering shopkeepers and administrators with robust dashboards for order management and analytics.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.1.1-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.8.0-FFCA28?logo=firebase&logoColor=black)

## ✨ Features

### 👤 Client Portal
- **Interactive Menu:** Browse available items with a smooth, responsive interface.
- **Real-time Cart:** Global cart drawer accessible from anywhere in the app.
- **Order Management:** Place orders and track their status in real-time.
- **Authentication:** Secure signup and login.

### 🏪 Shopkeeper Dashboard
- **Order Processing:** View and update the status of incoming orders.
- **Analytics:** Visualized sales and performance data using Recharts.
- **Inventory Management:** Oversee and manage available shop items.

### 👑 Admin Dashboard
- **System Overview:** High-level insights and platform-wide analytics.
- **Role Management:** Securely manage users and their access levels (Admin/Shopkeeper/Client).
- **Data Control:** Full control over the platform's data and operations.

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling & Animations:** Framer Motion (for smooth UI transitions), custom CSS.
- **Icons:** Lucide React
- **Charts:** Recharts
- **Backend/BaaS:** Firebase (Authentication, Firestore Database)
- **Linting:** ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/preetammm/CHICKEN-.git
   cd CHICKEN-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Go to your [Firebase Console](https://console.firebase.google.com/).
   - Create a web app and copy the configuration object.
   - Set up your environment variables (typically in a `.env` file at the root) matching the keys used in `src/firebase.js`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── assets/         # Static assets like images and fonts
├── components/     # Reusable UI components (CartDrawer, Navbar, etc.)
├── context/        # React Context providers (AuthContext, CartContext)
├── pages/          # Application routes/pages
│   ├── admin/      # Admin-specific views
│   ├── client/     # Customer-facing views
│   └── shopkeeper/ # Shop manager views
├── services/       # External API and Firebase service logic
├── App.jsx         # Main application router and layout
└── firebase.js     # Firebase initialization and config
```

## 🔒 Security & Rules

This project uses Firebase Authentication alongside a custom `PrivateRoute` component to enforce role-based access control (RBAC). 
- Ensure your `firestore.rules` are properly deployed to secure your database according to user roles.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
