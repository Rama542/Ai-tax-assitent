import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { User, Building2, Phone, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, title: 'Personal Info', desc: 'Tell us about yourself' },
  { id: 2, title: 'Tax Details', desc: 'PAN, Aadhaar & GSTIN' },
  { id: 3, title: 'Business Setup', desc: 'Optional business profile' },
  { id: 4, title: 'Ready!', desc: 'All set to go' },
];

export default function OnboardingPage() {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    phone: '', pan: '', aadhaar: '', gstin: '',
    businessName: '', industry: '', city: '', state: '',
  });

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      if (db && currentUser?.uid) {
        const ref = doc(db, 'users', currentUser.uid);
        await updateDoc(ref, {
          ...data,
          onboardingComplete: true,
          updatedAt: serverTimestamp(),
        });
      }
      setUserProfile(prev => ({ ...prev, ...data, onboardingComplete: true }));
      toast.success('Profile complete! Welcome to AI TaxOS 🎉');
      navigate('/dashboard');
    } catch (e) {
      setUserProfile(prev => ({ ...prev, ...data, onboardingComplete: true }));
      toast.success('Profile complete!');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const StepContent = () => {
    switch (step) {
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" className="form-input" style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">City</label>
              <input value={data.city} onChange={e => update('city', e.target.value)} placeholder="Mumbai" className="form-input" />
            </div>
            <div>
              <label className="form-label">State</label>
              <select value={data.state} onChange={e => update('state', e.target.value)} className="form-input" style={{ cursor: 'pointer' }}>
                <option value="">Select state</option>
                {['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan','West Bengal','Uttar Pradesh','Telangana','Kerala','Punjab','Haryana'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">PAN Number <span style={{ color: 'var(--accent-red)' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={data.pan} onChange={e => update('pan', e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} className="form-input" style={{ paddingLeft: 40, letterSpacing: 2 }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Required for income tax filing and verification</p>
          </div>
          <div>
            <label className="form-label">Aadhaar Number <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(Optional)</span></label>
            <input value={data.aadhaar} onChange={e => update('aadhaar', e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={12} className="form-input" />
          </div>
          <div>
            <label className="form-label">GSTIN <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(For GST registered businesses)</span></label>
            <input value={data.gstin} onChange={e => update('gstin', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} className="form-input" style={{ letterSpacing: 1 }} />
          </div>
        </div>
      );
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 4 }}>
            <p style={{ fontSize: 13, color: '#93c5fd' }}>💡 Skip this if you're an individual taxpayer. You can add business details later.</p>
          </div>
          <div>
            <label className="form-label">Business Name</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={data.businessName} onChange={e => update('businessName', e.target.value)} placeholder="Acme Pvt. Ltd." className="form-input" style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div>
            <label className="form-label">Industry</label>
            <select value={data.industry} onChange={e => update('industry', e.target.value)} className="form-input" style={{ cursor: 'pointer' }}>
              <option value="">Select industry</option>
              {['Technology','Retail','Manufacturing','Healthcare','Finance','Education','Consulting','Real Estate','Food & Beverage','Logistics','Other'].map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
      );
      case 4: return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="#34d399" />
          </motion.div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>You're all set! 🎉</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
            Your AI TaxOS profile is ready. You can now access your dashboard, upload documents, and start getting AI-powered tax guidance.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 }}>
            {[['🤖','AI Tax Assistant'],['📊','Dashboard'],['📄','Documents'],['💰','Tax Calculator']].map(([icon, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
                  background: step > s.id ? '#10b981' : step === s.id ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                  color: step >= s.id ? 'white' : 'var(--text-muted)',
                }}>
                  {step > s.id ? '✓' : s.id}
                </div>
                {i < steps.length - 1 && <div style={{ width: 50, height: 2, background: step > s.id ? '#10b981' : 'rgba(255,255,255,0.06)', transition: 'all 0.3s', borderRadius: 1 }} />}
              </div>
            ))}
          </div>
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{steps[step - 1].title}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{steps[step - 1].desc}</p>
          </div>

          <StepContent />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary" style={{ marginLeft: 'auto' }}>
                {step === 3 ? 'Almost done' : 'Continue'} <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={completeOnboarding} className="btn-primary" disabled={loading} style={{ marginLeft: 'auto' }}>
                {loading ? 'Setting up...' : 'Go to Dashboard'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
