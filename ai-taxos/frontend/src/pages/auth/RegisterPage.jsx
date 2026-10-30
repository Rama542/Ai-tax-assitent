import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Globe, Sparkles, Briefcase, Calculator, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  { value:'individual', label:'Individual Taxpayer', icon:'👤', desc:'For salaried employees & freelancers' },
  { value:'business', label:'Business Owner', icon:'🏢', desc:'For proprietors, companies & LLPs' },
  { value:'ca', label:'Chartered Accountant', icon:'📊', desc:'Manage multiple clients & filings' },
];

export default function RegisterPage() {
  const { register: reg, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('business');
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role:'business' } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await reg(data.email, data.password, data.name, selectedRole);
      toast.success('Account created! Welcome to AI TaxOS 🎉');
      navigate('/dashboard', { replace: true });
    } catch (e) {
      const msg = e.code === 'auth/email-already-in-use' ? 'Email already registered. Please sign in.' :
                  e.code === 'auth/weak-password' ? 'Password must be at least 6 characters.' :
                  'Registration failed. Please try again.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle(selectedRole);
      navigate('/dashboard', { replace: true });
    } catch {
      toast.error('Google sign-in failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ overflowY:'auto', paddingTop:32 }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <div className="auth-logo">
            <div className="auth-logo-icon"><Sparkles size={20} color="#fff" /></div>
            <div className="auth-logo-text" style={{ fontFamily:'Plus Jakarta Sans', color:'#1B2559' }}>AI TaxOS</div>
          </div>

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join 10,000+ businesses managing taxes smarter with AI.</p>

          {/* Role Selector */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
            <label className="form-label">I am a...</label>
            {ROLES.map(r => (
              <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:12, border:`2px solid ${selectedRole===r.value?'var(--brand)':'var(--border)'}`, background:selectedRole===r.value?'var(--brand-light)':'var(--bg)', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                <span style={{ fontSize:20 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{r.label}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-secondary)' }}>{r.desc}</div>
                </div>
                {selectedRole===r.value && <div style={{ marginLeft:'auto', width:16, height:16, borderRadius:'50%', background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'#fff', fontSize:10 }}>✓</span></div>}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position:'relative' }}>
                <User size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input {...register('name', { required:'Full name required' })} placeholder="Rama Sasank" className={`form-input ${errors.name?'error':''}`} style={{ paddingLeft:40 }} />
              </div>
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input {...register('email', { required:'Email required', pattern:{ value:/^\S+@\S+\.\S+$/, message:'Invalid email' } })} type="email" placeholder="your@email.com" className={`form-input ${errors.email?'error':''}`} style={{ paddingLeft:40 }} />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input {...register('password', { required:'Password required', minLength:{ value:6, message:'Min 6 characters' } })} type={showPass?'text':'password'} placeholder="Min 6 characters" className={`form-input ${errors.password?'error':''}`} style={{ paddingLeft:40, paddingRight:42 }} />
                <button type="button" onClick={() => setShowPass(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'12px', marginTop:4, fontSize:14 }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" /><span className="auth-divider-text">or</span><div className="auth-divider-line" />
          </div>
          <button onClick={handleGoogle} className="auth-google-btn" disabled={loading}>
            <Globe size={18} /> Continue with Google
          </button>

          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </motion.div>
      </div>

      <div className="auth-right">
        <div className="auth-right-orb1" />
        <div className="auth-right-orb2" />
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.1 }}
          style={{ position:'relative', zIndex:1, color:'#fff', maxWidth:380 }}>
          <div style={{ fontSize:40, marginBottom:16, textAlign:'center' }}>🚀</div>
          <h2 style={{ fontSize:26, fontWeight:800, marginBottom:12, letterSpacing:'-0.5px', textAlign:'center' }}>Everything You Need for Tax Compliance</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:24 }}>
            {[
              {icon:'📊', t:'Smart Dashboard'}, {icon:'🧾', t:'GST Filing'},
              {icon:'💰', t:'Income Tax'}, {icon:'📈', t:'AI Insights'},
              {icon:'📄', t:'PDF Reports'}, {icon:'☁️', t:'Cloud Sync'},
            ].map(i => (
              <div key={i.t} style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'14px', display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
                <span style={{ fontSize:24 }}>{i.icon}</span>
                <span style={{ fontSize:12, fontWeight:600, textAlign:'center' }}>{i.t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
