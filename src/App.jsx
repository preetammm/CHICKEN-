import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ClientHome from './pages/client/Home';
import ClientMenu from './pages/client/Menu';
import ClientOrders from './pages/client/Orders';
import OrderSuccess from './pages/client/OrderSuccess';
import AdminDashboard from './pages/admin/Dashboard';


import ShopDashboard from './pages/shopkeeper/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

import GlobalNavigation from './components/GlobalNavigation';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <GlobalNavigation />
            <CartDrawer />
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<ClientHome />} />
              <Route path="/menu" element={<ClientMenu />} />
              <Route path="/orders" element={<ClientOrders />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin Routes (Protected) */}
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />

              {/* Shopkeeper Routes (Protected) */}
              <Route path="/shop" element={
                <PrivateRoute allowedRoles={['shopkeeper', 'admin']}>
                  <ShopDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
