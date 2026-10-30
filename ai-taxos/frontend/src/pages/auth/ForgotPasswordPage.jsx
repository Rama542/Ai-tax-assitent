import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch {
      toast.error('Failed to send reset link. Check the email address.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <div className="auth-logo">
            <div className="auth-logo-icon"><Sparkles size={20} color="#fff" /></div>
            <div className="auth-logo-text" style={{ fontFamily:'Plus Jakarta Sans', color:'#1B2559' }}>AI TaxOS</div>
          </div>

          <Link to="/login" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--text-secondary)', fontSize:13, fontWeight:500, textDecoration:'none', marginBottom:24 }}>
            <ArrowLeft size={15} /> Back to Sign In
          </Link>

          {sent ? (
            <div style={{ textAlign:'center', padding:'32px 0' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>📬</div>
              <h2 style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Check your inbox</h2>
              <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7 }}>
                We've sent a password reset link to your email address. Click the link to reset your password.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ marginTop:24, display:'inline-flex', justifyContent:'center', padding:'11px 28px' }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="auth-title">Forgot Password?</h1>
              <p className="auth-subtitle">Enter your email address and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position:'relative' }}>
                    <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                    <input {...register('email', { required:'Email required', pattern:{ value:/^\S+@\S+\.\S+$/, message:'Invalid email' } })} type="email" placeholder="your@email.com" className={`form-input ${errors.email?'error':''}`} style={{ paddingLeft:40 }} />
                  </div>
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:14 }}>
                  {loading ? 'Sending...' : 'Send Reset Link →'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>

      <div className="auth-right">
        <div className="auth-right-orb1" />
        <div className="auth-right-orb2" />
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          style={{ position:'relative', zIndex:1, color:'#fff', textAlign:'center' }}>
          <div style={{ fontSize:64, marginBottom:20 }}>🔐</div>
          <h2 style={{ fontSize:24, fontWeight:700, marginBottom:10 }}>Secure Password Recovery</h2>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, lineHeight:1.7 }}>Your account is secured with Firebase Authentication. Reset links expire in 1 hour.</p>
        </motion.div>
      </div>
    </div>
  );
}
