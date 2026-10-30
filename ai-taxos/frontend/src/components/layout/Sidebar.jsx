import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Receipt, ShoppingCart, Store, Package,
  CreditCard, Users, FileText, Calculator, BarChart3, Brain, FolderOpen,
  Settings, LogOut, ChevronRight, Sparkles, Star, Menu, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to:'/dashboard', icon:LayoutDashboard, label:'Dashboard' },
  {
    section:'ACCOUNTING',
    items:[
      { to:'/revenue', icon:TrendingUp, label:'Revenue' },
      { to:'/expenses', icon:Receipt, label:'Expenses' },
      { to:'/purchases', icon:ShoppingCart, label:'Purchases' },
      { to:'/sales', icon:Store, label:'Sales' },
      { to:'/assets', icon:Package, label:'Assets' },
      { to:'/liabilities', icon:CreditCard, label:'Liabilities' },
      { to:'/employees', icon:Users, label:'Employees' },
      { to:'/gst', icon:FileText, label:'GST' },
      { to:'/income-tax', icon:Calculator, label:'Income Tax' },
      { to:'/reports', icon:BarChart3, label:'Reports' },
    ]
  },
  { to:'/ai-insights', icon:Brain, label:'AI INSIGHTS', section_before:true },
  { to:'/documents', icon:FolderOpen, label:'DOCUMENTS', section_before:true },
  { to:'/settings', icon:Settings, label:'SETTINGS', section_before:true },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const initials = (userProfile?.name || 'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const planLabel = userProfile?.role === 'ca' ? 'CA Plan' : userProfile?.role === 'business' ? 'Business Plan' : 'Personal Plan';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:99, display:'none' }} className="mobile-overlay" />}

      <aside className="app-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Sparkles size={18} color="#fff" /></div>
          <div>
            <div className="sidebar-logo-text">AI TaxOS</div>
            <div className="sidebar-logo-sub">Smart. Simple. Secure.</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Dashboard */}
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item${isActive?' active':''}`}>
            <LayoutDashboard className="sidebar-item-icon" size={18} />
            <span>Dashboard</span>
          </NavLink>

          {/* Accounting section */}
          <div className="sidebar-section-label">ACCOUNTING</div>
          {[
            { to:'/revenue', icon:TrendingUp, label:'Revenue' },
            { to:'/expenses', icon:Receipt, label:'Expenses' },
            { to:'/purchases', icon:ShoppingCart, label:'Purchases' },
            { to:'/sales', icon:Store, label:'Sales' },
            { to:'/assets', icon:Package, label:'Assets' },
            { to:'/liabilities', icon:CreditCard, label:'Liabilities' },
            { to:'/employees', icon:Users, label:'Employees' },
            { to:'/gst', icon:FileText, label:'GST' },
            { to:'/income-tax', icon:Calculator, label:'Income Tax' },
            { to:'/reports', icon:BarChart3, label:'Reports' },
          ].map(({ to, icon:Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-item${isActive?' active':''}`}>
              <Icon className="sidebar-item-icon" size={17} />
              <span>{label}</span>
              <ChevronRight className="sidebar-item-arrow" size={14} />
            </NavLink>
          ))}

          {/* Other sections */}
          <div className="sidebar-section-label" style={{ marginTop:8 }}>AI INSIGHTS</div>
          <NavLink to="/ai-insights" className={({ isActive }) => `sidebar-item${isActive?' active':''}`}>
            <Brain className="sidebar-item-icon" size={17} />
            <span>AI Insights</span>
          </NavLink>

          <div className="sidebar-section-label">DOCUMENTS</div>
          <NavLink to="/documents" className={({ isActive }) => `sidebar-item${isActive?' active':''}`}>
            <FolderOpen className="sidebar-item-icon" size={17} />
            <span>Documents</span>
          </NavLink>

          <div className="sidebar-section-label">SETTINGS</div>
          <NavLink to="/settings" className={({ isActive }) => `sidebar-item${isActive?' active':''}`}>
            <Settings className="sidebar-item-icon" size={17} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Bottom area */}
        <div className="sidebar-bottom">
          {/* Plan badge */}
          <div className="sidebar-plan-badge">
            <div className="sidebar-plan-title">
              <Star size={12} fill="gold" color="gold" />
              {planLabel}
              <span className="badge badge-premium" style={{ fontSize:9, padding:'2px 7px' }}>Premium</span>
            </div>
            <div className="sidebar-plan-sub">Valid till 31 Dec 2026</div>
            <button className="sidebar-plan-btn">View Plan</button>
          </div>

          {/* User info */}
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="sidebar-user-name">{userProfile?.name || 'User'}</div>
              <div className="sidebar-user-role">{userProfile?.role === 'business' ? 'Business Owner' : userProfile?.role === 'ca' ? 'Chartered Accountant' : userProfile?.role === 'admin' ? 'Admin' : 'Individual'}</div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', padding:4, borderRadius:6, transition:'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
