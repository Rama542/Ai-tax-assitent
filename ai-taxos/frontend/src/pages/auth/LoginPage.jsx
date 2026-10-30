import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Globe, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch {
      toast.error('Invalid email or password. Try demo mode: any email/password.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (e) {
      toast.error('Google sign-in failed. Running in demo mode.');
      navigate('/dashboard', { replace: true });
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left — Form */}
      <div className="auth-left">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon"><Sparkles size={20} color="#fff" /></div>
            <div className="auth-logo-text" style={{ fontFamily:'Plus Jakarta Sans', color:'#1B2559' }}>AI TaxOS</div>
          </div>

          <h1 className="auth-title">Welcome back 👋</h1>
          <p className="auth-subtitle">Sign in to your account to continue managing your taxes & accounting.</p>

          {/* Demo hint */}
          <div style={{ background:'#EEF4FF', border:'1.5px solid rgba(67,24,255,0.15)', borderRadius:12, padding:'10px 14px', marginBottom:24, display:'flex', gap:8, alignItems:'flex-start' }}>
            <AlertCircle size={15} color="#4318FF" style={{ marginTop:1, flexShrink:0 }} />
            <p style={{ fontSize:12.5, color:'#4318FF', lineHeight:1.5 }}>
              <strong>Demo Mode:</strong> Enter any email & password to explore the full dashboard with sample data.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input {...register('email', { required:'Email required' })} type="email" placeholder="your@email.com" className={`form-input ${errors.email?'error':''}`} style={{ paddingLeft:40 }} />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize:12, color:'var(--brand)', textDecoration:'none', fontWeight:600 }}>Forgot password?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input {...register('password', { required:'Password required' })} type={showPass?'text':'password'} placeholder="Your password" className={`form-input ${errors.password?'error':''}`} style={{ paddingLeft:40, paddingRight:42 }} />
                <button type="button" onClick={() => setShowPass(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'12px', marginTop:4, fontSize:14 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or continue with</span>
            <div className="auth-divider-line" />
          </div>

          <button onClick={handleGoogle} className="auth-google-btn" disabled={loading}>
            <Globe size={18} /> Continue with Google
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Brand panel */}
      <div className="auth-right">
        <div className="auth-right-orb1" />
        <div className="auth-right-orb2" />
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.1 }}
          style={{ position:'relative', zIndex:1, textAlign:'center', color:'#fff', maxWidth:400 }}>
          <div style={{ fontSize:48, marginBottom:20 }}>✨</div>
          <h2 style={{ fontSize:28, fontWeight:800, marginBottom:12, letterSpacing:'-0.5px' }}>India's Smartest Tax Platform</h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.7, marginBottom:32 }}>
            GST filing, income tax calculations, bookkeeping, AI-powered insights — all in one beautiful dashboard.
          </p>
          {[
            { icon:'🧾', label:'Auto GST Calculation' },
            { icon:'📊', label:'AI Financial Insights' },
            { icon:'📄', label:'One-Click Tax Reports' },
            { icon:'🔒', label:'Bank-Grade Security' },
          ].map(f => (
            <div key={f.label} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12, textAlign:'left', background:'rgba(255,255,255,0.07)', padding:'10px 16px', borderRadius:12 }}>
              <span style={{ fontSize:20 }}>{f.icon}</span>
              <span style={{ fontSize:14, fontWeight:500 }}>{f.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
