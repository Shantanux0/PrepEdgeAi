import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup } from '../api/apiClient';
import { Brain, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await signup(form);
      saveAuth(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  const perks = ['AI-generated interview questions', 'Company-specific targeting', 'Detailed model answers', 'Multiple topics at once'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-900)', position: 'relative', overflow: 'hidden' }}>
      {/* Orbs */}
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: '-10%', left: '-15%', opacity: 0.35 }} />
      <div className="orb orb-cyan" style={{ width: 400, height: 400, bottom: '-10%', right: '-10%', opacity: 0.25 }} />

      {/* Left panel */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        style={{ flex: 1, display: 'none', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', position: 'relative', zIndex: 1 }} 
        className="auth-left-panel"
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem' }}>Prep<span style={{ color: '#7c3aed' }}>Edge</span> <span style={{ color: '#7c3aed', fontSize: '0.7rem' }}>AI</span></span>
        </Link>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
          The smartest way to<br /><span className="gradient-text">prep for interviews</span>
        </h2>
        <p style={{ color: 'var(--text-300)', marginBottom: 40, lineHeight: 1.7 }}>Join thousands of developers who've landed offers at top companies.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {perks.map((p, i) => (
            <motion.div 
              key={p} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <CheckCircle size={18} color="var(--primary)" />
              <span style={{ color: 'var(--text-200)', fontSize: '0.95rem' }}>{p}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right: form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }} className="mobile-logo">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem' }}>Prep<span style={{ color: '#7c3aed' }}>Edge</span> <span style={{ color: '#7c3aed', fontSize: '0.65rem' }}>AI</span></span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="card auth-card" 
            style={{ padding: 40 }}
          >
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-400)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Sparkles size={13} /> Start for Free
                </span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Create your account</h1>
              <p style={{ color: 'var(--text-300)', marginTop: 8, fontSize: '0.9rem' }}>Start preparing smarter today</p>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input id="name" name="name" className="form-input" type="text" placeholder="John Doe" required value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input id="email" name="email" className="form-input" type="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input id="password" name="password" className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" required minLength={8} value={form.password} onChange={handleChange} style={{ width: '100%', paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-400)', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                {loading ? <><div className="spinner" /> Creating Account…</> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="divider" />
            <p style={{ textAlign: 'center', color: 'var(--text-300)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
      <style>{`@media(min-width:900px){.auth-left-panel{display:flex!important}.mobile-logo{display:none!important}}`}</style>
    </div>
  );
}
