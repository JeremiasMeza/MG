import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes/index';
import { AuthProvider } from './context/AuthContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
