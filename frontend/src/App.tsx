import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import React from "react";

import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

// Pages
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { AddProduct } from "./pages/AddProduct";
import { Warehouses } from "./pages/Warehouses";
import { AddWarehouse } from "./pages/AddWarehouse";
import { Locations } from "./pages/Locations";
import { Receipts } from "./pages/Receipts";
import { AddReceipt } from "./pages/AddReceipt";
import { Deliveries } from "./pages/Deliveries";
import { AddDelivery } from "./pages/AddDelivery";
import { MovementHistory } from "./pages/MovementHistory";
import { StockAvailability } from "./pages/StockAvailability";
import { Profile } from "./pages/Profile";
import { InternalTransfers } from './pages/InternalTransfers';
import { CreateInternalTransfer } from './pages/CreateInternalTransfer';
import { InternalTransferDetail } from './pages/InternalTransferDetail';

export default function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/internal-transfers" element={
            <ProtectedRoute>
              <Layout><InternalTransfers /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/internal-transfers/create" element={
            <ProtectedRoute>
              <Layout><CreateInternalTransfer /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/internal-transfers/:id" element={
            <ProtectedRoute>
              <Layout><InternalTransferDetail /></Layout>
            </ProtectedRoute>
          } />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* ✅ Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddProduct />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/warehouses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Warehouses />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/warehouses/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddWarehouse />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/locations"
            element={
              <ProtectedRoute>
                <Layout>
                  <Locations />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/receipts"
            element={
              <ProtectedRoute>
                <Layout>
                  <Receipts />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/receipts/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddReceipt />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/deliveries"
            element={
              <ProtectedRoute>
                <Layout>
                  <Deliveries />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/deliveries/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddDelivery />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/movement-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <MovementHistory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <Layout>
                  <StockAvailability />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ✅ Catch-All Route */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>

        {/* ✅ Global Toast Notifications */}
        <Toaster position="bottom-right" duration={3500} />
      </Router>
    </AuthProvider>
  );
}
