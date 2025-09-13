// src/App.js
import React from 'react';
import { ThemeProvider } from './componets/context/ThemeContext';
import { AuthProvider } from './componets/context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './componets/layouts/Layout';
import ProtectedRoute from './componets/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Fees from './pages/Fees';
import Expenditures from './pages/Expenditures';
import MatchIncomes from './pages/MatchIncomes';
import NotFound from './pages/NotFound'; // Import the 404 component

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route - Login page without layout */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/students" element={
              <ProtectedRoute>
                <Layout>
                  <Students />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/fees" element={
              <ProtectedRoute>
                <Layout>
                  <Fees />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/expenditures" element={
              <ProtectedRoute>
                <Layout>
                  <Expenditures />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/match-incomes" element={
              <ProtectedRoute>
                <Layout>
                  <MatchIncomes />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 404 page for undefined routes */}
            <Route path="/404" element={<NotFound />} />
            
            {/* Catch all route - redirect to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;