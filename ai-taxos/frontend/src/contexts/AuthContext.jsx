import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,
  signOut, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification, updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isConfigured } from '../firebase/config';
import { MOCK_USER, MOCK_PROFILE } from '../data/mockData';
import { DEFAULT_FINANCIALS } from '../utils/taxCalculator';

const AuthContext = createContext(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('taxos_session_active');
    return saved === 'true' ? MOCK_USER : null;
  });
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('taxos_session_active');
    return saved === 'true' ? MOCK_PROFILE : null;
  });
  const [loading, setLoading] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Financials State
  const [userFinancials, setUserFinancials] = useState(() => {
    try {
      const stored = localStorage.getItem('taxos_user_financials');
      return stored ? { ...DEFAULT_FINANCIALS, ...JSON.parse(stored) } : DEFAULT_FINANCIALS;
    } catch {
      return DEFAULT_FINANCIALS;
    }
  });

  const updateFinancials = (updatedData) => {
    const updated = { ...userFinancials, ...updatedData };
    setUserFinancials(updated);
    try {
      localStorage.setItem('taxos_user_financials', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const createUserProfile = async (uid, data) => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'users', uid), { uid, ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    } catch (e) { console.warn('Firestore write:', e.message); }
  };

  const fetchUserProfile = async (uid) => {
    if (!db) return null;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) { setUserProfile(snap.data()); return snap.data(); }
    } catch (e) { console.warn('Firestore read:', e.message); }
    return null;
  };

  const register = async (email, password, name, role = 'individual') => {
    setLoading(true);
    try {
      if (isConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await sendEmailVerification(cred.user).catch(() => {});
        await createUserProfile(cred.user.uid, { name, email, role, phone: '', pan: '', gstin: '', onboardingComplete: false });
        setCurrentUser(cred.user);
        setUserProfile({ uid: cred.user.uid, name, email, role, onboardingComplete: false });
        localStorage.setItem('taxos_session_active', 'true');
        setShowOnboardingModal(true);
        return cred.user;
      }
      // Demo mode
      const u = { uid: 'user-' + Date.now(), displayName: name, email, emailVerified: true };
      const p = { uid: u.uid, name, email, role, phone: '', pan: '', gstin: '', onboardingComplete: false };
      setCurrentUser(u);
      setUserProfile(p);
      localStorage.setItem('taxos_session_active', 'true');
      setShowOnboardingModal(true);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(cred.user);
        await fetchUserProfile(cred.user.uid);
        localStorage.setItem('taxos_session_active', 'true');
        return cred.user;
      }
      // Demo mode — sign in works directly
      setCurrentUser(MOCK_USER);
      setUserProfile(MOCK_PROFILE);
      localStorage.setItem('taxos_session_active', 'true');
      return MOCK_USER;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role = 'individual') => {
    setLoading(true);
    try {
      if (isConfigured && auth && googleProvider) {
        const cred = await signInWithPopup(auth, googleProvider);
        const profile = await fetchUserProfile(cred.user.uid);
        if (!profile) await createUserProfile(cred.user.uid, { name: cred.user.displayName, email: cred.user.email, role, photoURL: cred.user.photoURL, onboardingComplete: false });
        setCurrentUser(cred.user);
        localStorage.setItem('taxos_session_active', 'true');
        return cred.user;
      }
      setCurrentUser(MOCK_USER);
      setUserProfile({ ...MOCK_PROFILE, role });
      localStorage.setItem('taxos_session_active', 'true');
      return MOCK_USER;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isConfigured && auth) await signOut(auth).catch(() => {});
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('taxos_session_active');
  };

  const resetPassword = (email) => {
    if (isConfigured && auth) return sendPasswordResetEmail(auth, email);
    return Promise.resolve();
  };

  useEffect(() => {
    let unsub = () => {};
    if (isConfigured && auth) {
      unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          await fetchUserProfile(user.uid);
          localStorage.setItem('taxos_session_active', 'true');
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          localStorage.removeItem('taxos_session_active');
        }
      });
    }
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser, userProfile, setUserProfile, loading,
      register, login, loginWithGoogle, logout, resetPassword,
      createUserProfile, fetchUserProfile,
      userFinancials, updateFinancials,
      showOnboardingModal, setShowOnboardingModal
    }}>
      {loading ? (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0B1437', flexDirection:'column', gap:16 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:'linear-gradient(135deg,#7B5EA7,#4318FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>✨</div>
          <div style={{ color:'#fff', fontSize:15, fontWeight:600 }}>Loading AI TaxOS...</div>
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>India's Smart Tax Platform</div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

