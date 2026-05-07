import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Brain, Menu, X, LogOut, Zap, Star, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  // Smooth scroll to section on landing page
  const scrollTo = (id) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Features', action: () => scrollTo('features') },
    { label: 'How It Works', action: () => scrollTo('how-it-works') },
    { label: 'Important Bank', to: '/bank', icon: <Star size={13} color="#f59e0b" fill="#f59e0b" /> },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled ? (theme === 'dark' ? 'rgba(5,5,8,0.92)' : 'rgba(248,250,252,0.92)') : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>

        {/* Logo — click scrolls to top of hero */}
        <button onClick={() => {
          if (location.pathname === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
          else { navigate('/'); }
        }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            <Brain size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px', color: 'var(--text-100)' }}>
            Prep<span style={{ color: '#8b5cf6' }}>Edge</span> <span style={{ color: '#06b6d4', fontSize: '0.7rem', fontWeight: 600 }}>AI</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
          {navLinks.map(l => (
            l.to ? (
              <Link key={l.label} to={l.to}
                id={l.label === 'Important Bank' ? 'nav-bank-link' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  color: location.pathname === l.to ? '#f59e0b' : '#94a3b8',
                  fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fbbf24'}
                onMouseLeave={e => e.currentTarget.style.color = location.pathname === l.to ? '#f59e0b' : '#94a3b8'}
              >
                {l.icon}{l.label}
              </Link>
            ) : (
              <button key={l.label} onClick={l.action} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, padding: 0, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#e2e8f0'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >{l.label}</button>
            )
          ))}
        </div>

        {/* Theme Toggle & Auth buttons */}
        <div className="nav-buttons" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={toggleTheme} style={{ 
            background: 'var(--surface)', border: '1px solid var(--border)', 
            borderRadius: '50%', width: 36, height: 36, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: 'var(--text-300)', transition: 'all 0.2s', marginRight: 8
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-300)'; }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ gap: 6 }}>
                  <Zap size={14} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'none', cursor: 'pointer' }} className="menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: theme === 'dark' ? 'rgba(10,10,18,0.98)' : 'rgba(255,255,255,0.98)', borderTop: '1px solid var(--border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {navLinks.map(l => (
            l.to ? (
              <Link key={l.label} to={l.to} style={{ color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setMenuOpen(false)}>{l.icon}{l.label}</Link>
            ) : (
              <button key={l.label} onClick={l.action} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', textAlign: 'left', fontWeight: 500, fontSize: '1rem' }}>{l.label}</button>
            )
          ))}
          {user ? (
            <button onClick={handleLogout} style={{ color: '#fca5a5', textAlign: 'left', background: 'none', border: 'none', fontWeight: 500 }}>Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: '#94a3b8' }}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ color: '#8b5cf6', fontWeight: 600 }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
      <style>{`@media(max-width:768px){.desktop-nav, .desktop-auth{display:none!important}.menu-btn{display:flex!important}}`}</style>
    </nav>
  );
}
