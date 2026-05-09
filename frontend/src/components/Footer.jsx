import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-800)', padding: '60px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} color="white" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>
                Prep<span style={{ color: '#8b5cf6' }}>Edge</span> <span style={{ color: '#06b6d4', fontSize: '0.65rem' }}>AI</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-300)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 260 }}>
              AI-powered interview preparation. Generate hyper-relevant questions and ace your next technical interview.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ color: 'var(--text-200)', fontWeight: 600, marginBottom: 16, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Product</h4>
            {['Dashboard', 'Generate Questions', 'Topics'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <Link to="/dashboard" style={{ color: 'var(--text-300)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#8b5cf6'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-300)'}
                >{l}</Link>
              </div>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{ color: 'var(--text-200)', fontWeight: 600, marginBottom: 16, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Account</h4>
            {[{ label: 'Sign Up', to: '/signup' }, { label: 'Login', to: '/login' }].map(l => (
              <div key={l.label} style={{ marginBottom: 10 }}>
                <Link to={l.to} style={{ color: 'var(--text-300)', fontSize: '0.9rem' }}
                  onMouseEnter={e => e.target.style.color = '#8b5cf6'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-300)'}
                >{l.label}</Link>
              </div>
            ))}
          </div>

          {/* Social */}
          <div>
            <h4 style={{ color: 'var(--text-200)', fontWeight: 600, marginBottom: 16, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Connect</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'GitHub', url: 'https://github.com/Shantanux0', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                )},
                { label: 'LinkedIn', url: 'https://www.linkedin.com/in/shantanu-kale-2s20/', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                )},
              ].map(({ label, url, icon }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--text-300)', fontSize: '0.875rem', transition: 'color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-300)'}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                    {icon}
                  </div>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-400)', fontSize: '0.85rem' }}>© 2026 PrepEdge AI. All rights reserved.</p>
          <p style={{ color: 'var(--text-400)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            Built with <Heart size={14} style={{ color: '#8b5cf6' }} /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
