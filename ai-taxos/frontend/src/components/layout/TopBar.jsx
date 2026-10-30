import React, { useState } from 'react';
import { Search, Bell, Settings, Calendar, Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ setMobileOpen }) {
  const { userProfile, userFinancials, setShowOnboardingModal } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  const weekAgo = new Date(Date.now() - 7 * 86400000).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good Morning' : greetingHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="app-topbar">
      {/* Mobile hamburger */}
      <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)', padding:4, display:'none' }} className="mobile-menu-btn" onClick={() => setMobileOpen?.(o=>!o)}>
        <Menu size={22} />
      </button>

      {/* Greeting */}
      <div style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>
          {greeting}, <span style={{ color:'var(--brand)' }}>{(userProfile?.name || 'User').split(' ')[0]}</span> 👋
        </div>
        <div style={{ fontSize:12, color:'var(--text-secondary)' }}>
          {userFinancials?.businessName ? `${userFinancials.businessName} · PAN: ${userFinancials.pan || 'N/A'}` : "Here's what's happening with your business today."}
        </div>
      </div>

      {/* Search */}
      <div className="topbar-search" style={{ marginLeft:24 }}>
        <Search size={15} color="var(--text-muted)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search anything..." />
      </div>

      <div className="topbar-actions">
        {/* Quick Edit Financial Data */}
        <button
          onClick={() => setShowOnboardingModal(true)}
          className="btn btn-primary btn-sm"
          style={{ background: 'linear-gradient(135deg, #7B5EA7 0%, #4318FF 100%)', border: 'none', gap: 6, fontWeight: 700 }}
        >
          <Sparkles size={14} color="#fff" />
          <span>⚡ Enter/Edit Data</span>
        </button>

        {/* Date range */}
        <div className="topbar-date">
          <Calendar size={14} />
          <span>{weekAgo} – {today}</span>
        </div>

        {/* Notifications */}
        <div className="topbar-icon-btn" onClick={() => navigate('/ai-insights')} title="Notifications">
          <Bell size={17} />
          <div className="topbar-notif-dot" />
        </div>

        {/* Settings */}
        <div className="topbar-icon-btn" onClick={() => navigate('/settings')} title="Settings">
          <Settings size={17} />
        </div>
      </div>
    </header>
  );
}

