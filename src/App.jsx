import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/Home.jsx"
import { AdminPage } from "./pages/AdminPage.jsx"
import { UserFormPage } from "./pages/UserFormPage.jsx"
import { RecentFilesPage } from "./pages/RecentFilesPage.jsx"
import { LoginPage } from "./pages/LoginPage.jsx"
import { RegisterPage } from "./pages/RegisterPage.jsx"
import { AdminLoginPage } from "./pages/AdminLoginPage.jsx"
import { ProtectedRoute } from "./components/ProtectedRoute.jsx"
import { AdminRoute } from "./components/AdminRoute.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route
        path="/form/:slug/submission/:submissionId"
        element={
          <ProtectedRoute>
            <UserFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/form/:slug"
        element={
          <ProtectedRoute>
            <UserFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recent-files"
        element={
          <ProtectedRoute>
            <RecentFilesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
