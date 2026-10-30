import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Building2, Phone, Mail, Lock, CreditCard, Bell, Shield, LogOut, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TABS = ['Profile','Business','Security','Notifications'];

export default function SettingsPage() {
  const { userProfile, setUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    pan: userProfile?.pan || '',
    gstin: userProfile?.gstin || '',
    businessName: userProfile?.businessName || '',
    industry: userProfile?.industry || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
  });

  const save = () => {
    setUserProfile(p => ({ ...p, ...form }));
    toast.success('Settings saved!');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Signed out.');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account, business details and preferences</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:20, alignItems:'flex-start' }}>
        {/* Sidebar nav */}
        <div className="card" style={{ padding:8 }}>
          {TABS.map((t,i) => (
            <button key={t} onClick={() => setTab(i)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, border:'none', cursor:'pointer', background:tab===i?'var(--brand-light)':'transparent', color:tab===i?'var(--brand)':'var(--text-secondary)', fontWeight:tab===i?700:500, fontSize:13.5, transition:'all 0.15s', marginBottom:2 }}>
              {[<User size={16}/>, <Building2 size={16}/>, <Shield size={16}/>, <Bell size={16}/>][i]}
              {t}
            </button>
          ))}
          <div style={{ borderTop:'1px solid var(--border)', marginTop:8, paddingTop:8 }}>
            <button onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, border:'none', cursor:'pointer', background:'transparent', color:'var(--red)', fontWeight:500, fontSize:13.5 }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="card" style={{ padding:28 }}>
          {tab===0 && (
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:20 }}>Personal Profile</div>
              {/* Avatar */}
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, padding:'16px', background:'var(--bg)', borderRadius:14 }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#7B5EA7,#4318FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, color:'#fff' }}>
                  {(form.name||'U').charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{form.name || 'Your Name'}</div>
                  <div style={{ fontSize:13, color:'var(--text-secondary)' }}>{form.email}</div>
                  <div style={{ marginTop:6 }}><span className="badge badge-purple">{userProfile?.role || 'Individual'}</span></div>
                </div>
              </div>
              <div className="grid-2" style={{ gap:14 }}>
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} disabled style={{ opacity:0.7 }}/></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">PAN Number</label><input className="form-input" placeholder="ABCRS1234F" value={form.pan} onChange={e=>setForm(f=>({...f,pan:e.target.value.toUpperCase()}))}/></div>
              </div>
            </div>
          )}

          {tab===1 && (
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:20 }}>Business Details</div>
              <div className="grid-2" style={{ gap:14 }}>
                <div className="form-group"><label className="form-label">Business Name</label><input className="form-input" placeholder="Your Business Pvt Ltd" value={form.businessName} onChange={e=>setForm(f=>({...f,businessName:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">GSTIN</label><input className="form-input" placeholder="27AABCT1332L1ZV" value={form.gstin} onChange={e=>setForm(f=>({...f,gstin:e.target.value.toUpperCase()}))}/></div>
                <div className="form-group"><label className="form-label">Industry</label>
                  <select className="form-input" value={form.industry} onChange={e=>setForm(f=>({...f,industry:e.target.value}))}>
                    {['Technology','Healthcare','Finance','Retail','Manufacturing','Education','Other'].map(i=><option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="Hyderabad" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">State</label><select className="form-input" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))}>
                  {['Telangana','Maharashtra','Karnataka','Tamil Nadu','Delhi','Gujarat','Rajasthan','Uttar Pradesh','West Bengal','Other'].map(s=><option key={s}>{s}</option>)}
                </select></div>
              </div>
            </div>
          )}

          {tab===2 && (
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:20 }}>Security Settings</div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ background:'var(--bg)', borderRadius:12, padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:'#EEF4FF', display:'flex', alignItems:'center', justifyContent:'center' }}><Lock size={18} color="var(--brand)"/></div>
                    <div><div style={{ fontWeight:600, fontSize:13.5 }}>Change Password</div><div style={{ fontSize:12, color:'var(--text-secondary)' }}>Last changed: Never</div></div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Change</button>
                </div>
                <div style={{ background:'var(--bg)', borderRadius:12, padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:'#E6FAF5', display:'flex', alignItems:'center', justifyContent:'center' }}><Shield size={18} color="var(--green)"/></div>
                    <div><div style={{ fontWeight:600, fontSize:13.5 }}>Two-Factor Authentication</div><div style={{ fontSize:12, color:'var(--text-secondary)' }}>Protect your account with 2FA</div></div>
                  </div>
                  <span className="badge badge-gray">Disabled</span>
                </div>
              </div>
            </div>
          )}

          {tab===3 && (
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:20 }}>Notification Preferences</div>
              {[
                { title:'GST Filing Reminders', sub:'Get reminders 7 days before due date' },
                { title:'Tax Due Alerts', sub:'Receive alerts before tax payment deadlines' },
                { title:'Revenue Milestone Notifications', sub:'Celebrate when you hit revenue goals' },
                { title:'Weekly Financial Summary', sub:'Weekly email with P&L summary' },
                { title:'Compliance Updates', sub:'Latest changes in tax laws & notifications' },
              ].map((n, i) => (
                <div key={n.title} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
                  <div><div style={{ fontSize:13.5, fontWeight:600 }}>{n.title}</div><div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{n.sub}</div></div>
                  <label style={{ cursor:'pointer', position:'relative', display:'inline-block', width:40, height:22 }}>
                    <input type="checkbox" defaultChecked={i<3} style={{ opacity:0, width:0, height:0 }}/>
                    <span style={{ position:'absolute', inset:0, background:'var(--brand)', borderRadius:99, display:'flex', alignItems:'center', padding:'2px' }}>
                      <span style={{ width:18, height:18, borderRadius:'50%', background:'#fff', marginLeft:'auto', display:'block' }}/>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="divider" style={{ margin:'24px 0' }}/>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <button className="btn btn-primary" onClick={save}><Save size={15}/> Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
