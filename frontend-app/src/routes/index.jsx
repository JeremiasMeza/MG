import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../containers/pages/Login';
import Register from '../containers/pages/Register';
import Dashboard from '../containers/pages/Dashboard';
import Inventory from '../containers/pages/Inventory';
import Quotes from '../containers/pages/Quotes';
import { useAuth } from '../context/AuthContext'; // Asegúrate de tener un contexto de autenticación

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Obtener el usuario del contexto

  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/" />;
  }

  return children; // Si hay usuario, renderiza el componente hijo
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotes"
          element={
            <ProtectedRoute>
              <Quotes />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirige a login si la ruta no existe */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
