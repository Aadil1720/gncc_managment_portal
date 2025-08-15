import React, { useState, useMemo } from 'react';
import {ThemeProvider} from './componets/context/ThemeContext'
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './componets/layouts/Layout'; // Make sure path is correct
import AdminRoute from './componets/context/AdminRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Fees from './pages/Fees';
import Expenditures from './pages/Expenditures';
import MatchIncomes from './pages/MatchIncomes';




function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
           <Route path="/login" element={<Login />} />
               {/* Protected routes */}
        <Route path="/" 
        element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
       <Route
          path="/students"
          element={
            <AdminRoute>
              <Students />
            </AdminRoute>
          }
        />
         
        <Route
          path="/fees"
          element={
            <AdminRoute>
              <Fees />
            </AdminRoute>
          }
        /> 
           
        <Route
          path="/expenditures"
          element={
            <AdminRoute>
              <Expenditures/>
            </AdminRoute>
          }
        /> 
        <Route
          path="/match-incomes"
          element={
            <AdminRoute>
              <MatchIncomes/>
            </AdminRoute>
          }
        /> 
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
