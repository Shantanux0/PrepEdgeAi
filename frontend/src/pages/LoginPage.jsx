import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/apiClient';
import { Brain, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await login(form);
      saveAuth(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-900)', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-purple" style={{ width: 600, height: 600, top: '-20%', left: '-20%', opacity: 0.3 }} />
      <div className="orb orb-cyan" style={{ width: 500, height: 500, bottom: '-20%', right: '-15%', opacity: 0.25 }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem' }}>Prep<span style={{ color: '#7c3aed' }}>Edge</span> <span style={{ color: '#7c3aed', fontSize: '0.65rem' }}>AI</span></span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="card auth-card" 
          style={{ padding: 40 }}
        >
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-400)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Zap size={13} /> Welcome Back
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Sign in to PrepEdge</h1>
            <p style={{ color: 'var(--text-300)', marginTop: 8, fontSize: '0.9rem' }}>Continue your interview preparation</p>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input id="login-email" name="email" className="form-input" type="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input id="login-password" name="password" className="form-input" type={showPass ? 'text' : 'password'} placeholder="Your password" required value={form.password} onChange={handleChange} style={{ width: '100%', paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-400)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? <><div className="spinner" /> Signing In…</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-300)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
