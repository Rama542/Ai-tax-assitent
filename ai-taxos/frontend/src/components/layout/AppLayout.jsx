import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import FinancialOnboardingModal from '../onboarding/FinancialOnboardingModal';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showOnboardingModal, setShowOnboardingModal } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="app-main">
        <TopBar setMobileOpen={setMobileOpen} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <FinancialOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </div>
  );
}

