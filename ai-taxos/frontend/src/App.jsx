import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// App pages
import DashboardPage from './pages/dashboard/DashboardPage';
import RevenuePage from './pages/revenue/RevenuePage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import PurchasesPage from './pages/purchases/PurchasesPage';
import SalesPage from './pages/sales/SalesPage';
import AssetsPage from './pages/assets/AssetsPage';
import LiabilitiesPage from './pages/liabilities/LiabilitiesPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import GSTPage from './pages/gst/GSTPage';
import IncomeTaxPage from './pages/income-tax/IncomeTaxPage';
import ReportsPage from './pages/reports/ReportsPage';
import AIInsightsPage from './pages/ai/AIInsightsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import SettingsPage from './pages/settings/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/revenue" element={<RevenuePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/liabilities" element={<LiabilitiesPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/gst" element={<GSTPage />} />
            <Route path="/income-tax" element={<IncomeTaxPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/ai-insights" element={<AIInsightsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <Toaster position="top-right" toastOptions={{ duration:3500, style:{ fontFamily:'Inter, sans-serif', fontSize:13.5, borderRadius:12, boxShadow:'0 4px 20px rgba(112,144,176,0.18)' }, success:{ iconTheme:{ primary:'#05CD99', secondary:'#fff' } }, error:{ iconTheme:{ primary:'#EE5D50', secondary:'#fff' } } }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
