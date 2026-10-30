import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { User, Mail, Phone, CreditCard, Building2, Camera, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    pan: userProfile?.pan || '',
    gstin: userProfile?.gstin || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    businessName: userProfile?.businessName || '',
  });

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    try {
      if (db && currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      }
      setUserProfile(prev => ({ ...prev, ...form }));
      toast.success('Profile updated!');
    } catch (e) {
      setUserProfile(prev => ({ ...prev, ...form }));
      toast.success('Profile updated (demo mode)');
    } finally {
      setSaving(false);
    }
  };

  const roleLabels = { individual: 'Individual Taxpayer', business: 'Business Owner', ca: 'Chartered Accountant', admin: 'Administrator' };
  const roleColors = { individual: '#3b82f6', business: '#10b981', ca: '#8b5cf6', admin: '#f59e0b' };
  const role = userProfile?.role || 'individual';

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage your personal information and tax details</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Profile card */}
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, margin: '0 auto' }}>
                {(form.name || currentUser?.displayName || 'U')[0].toUpperCase()}
              </div>
              <button style={{ position: 'absolute', bottom: 0, right: -4, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={13} color="var(--text-secondary)" />
              </button>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{form.name || 'Your Name'}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{currentUser?.email}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${roleColors[role]}20`, color: roleColors[role], border: `1px solid ${roleColors[role]}40` }}>
              {role === 'ca' ? '📊' : role === 'business' ? '🏢' : role === 'admin' ? '🛡️' : '👤'} {roleLabels[role]}
            </span>
          </div>

          {/* Quick stats */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-secondary)' }}>Account Info</h4>
            {[
              { label: 'Member since', value: new Date(currentUser?.metadata?.creationTime).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
              { label: 'Email verified', value: currentUser?.emailVerified ? '✅ Verified' : '❌ Not verified' },
              { label: 'PAN', value: form.pan || 'Not added' },
              { label: 'GSTIN', value: form.gstin || 'Not added' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <User size={18} color="#3b82f6" />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Personal Information</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Full Name</label>
                <input value={form.name} onChange={e => updateForm('name', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+91 98765 43210" className="form-input" />
              </div>
              <div>
                <label className="form-label">City</label>
                <input value={form.city} onChange={e => updateForm('city', e.target.value)} placeholder="Mumbai" className="form-input" />
              </div>
              <div>
                <label className="form-label">State</label>
                <select value={form.state} onChange={e => updateForm('state', e.target.value)} className="form-input" style={{ cursor: 'pointer' }}>
                  <option value="">Select state</option>
                  {['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan','West Bengal','Uttar Pradesh','Telangana','Kerala'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Shield size={18} color="#8b5cf6" />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Tax & Compliance Details</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">PAN Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input value={form.pan} onChange={e => updateForm('pan', e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} className="form-input" style={{ letterSpacing: 2 }} />
              </div>
              <div>
                <label className="form-label">GSTIN <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>(Optional)</span></label>
                <input value={form.gstin} onChange={e => updateForm('gstin', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} className="form-input" />
              </div>
              {(role === 'business' || role === 'ca') && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">{role === 'ca' ? 'Practice Name' : 'Business Name'}</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={form.businessName} onChange={e => updateForm('businessName', e.target.value)} placeholder={role === 'ca' ? 'Mehta & Associates' : 'Acme Pvt. Ltd.'} className="form-input" style={{ paddingLeft: 40 }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Mail size={16} color="#60a5fa" />
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#93c5fd' }}>Email: </span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{currentUser?.email}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>(Cannot be changed)</span>
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 28px' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
