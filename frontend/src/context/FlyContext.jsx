import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* ── Flying star particle ── */
const FlyContext = createContext(null);

function FlyParticle({ id, x, y, tx, ty, onDone }) {
  return createPortal(
    <div
      id={`fly-${id}`}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--primary) 30%, rgba(80,80,80,0.3) 100%)',
        boxShadow: '0 0 12px rgba(80,80,80,0.8), 0 0 24px rgba(80,80,80,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        pointerEvents: 'none',
        zIndex: 99999,
        animation: `fly-to-bank 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        '--tx': `${tx - x}px`,
        '--ty': `${ty - y}px`,
      }}
    >
      ★
      <style>{`
        @keyframes fly-to-bank {
          0%   { opacity: 1; transform: scale(1.4) translate(0, 0); }
          30%  { opacity: 1; transform: scale(1.8) translate(calc(var(--tx)*0.2), calc(var(--ty)*0.2 - 40px)); }
          80%  { opacity: 0.9; transform: scale(0.9) translate(calc(var(--tx)*0.85), calc(var(--ty)*0.85)); }
          100% { opacity: 0; transform: scale(0.3) translate(var(--tx), var(--ty)); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ── Toast notification ── */
function SavedToast({ visible }) {
  return createPortal(
    <div style={{
      position: 'fixed',
      top: 80,
      right: 24,
      zIndex: 99998,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 20px',
      borderRadius: 12,
      background: 'rgba(20,20,36,0.95)',
      border: '1px solid rgba(80,80,80,0.4)',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(80,80,80,0.15)',
      color: 'var(--primary)',
      fontSize: '0.875rem',
      fontWeight: 600,
      transform: visible ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.9)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '18px' }}>⭐</span>
      Saved to Important Bank
      <a href="/bank" style={{
        color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700,
        textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.4)',
        pointerEvents: 'all',
      }}
        onMouseEnter={e => e.target.style.color = 'var(--primary)'}
        onMouseLeave={e => e.target.style.color = 'var(--primary)'}
      >View →</a>
    </div>,
    document.body
  );
}

/* ── Provider ── */
export function FlyProvider({ children }) {
  const [particles, setParticles] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);
  const counter = useRef(0);

  const fly = useCallback((sourceEl) => {
    // Find the Important Bank nav link
    const target = document.getElementById('nav-bank-link');
    if (!sourceEl || !target) return;

    const srcRect = sourceEl.getBoundingClientRect();
    const tgtRect = target.getBoundingClientRect();

    const id = ++counter.current;
    const x = srcRect.left + srcRect.width / 2 - 14;
    const y = srcRect.top + srcRect.height / 2 - 14;
    const tx = tgtRect.left + tgtRect.width / 2 - 14;
    const ty = tgtRect.top + tgtRect.height / 2 - 14;

    setParticles(p => [...p, { id, x, y, tx, ty }]);

    // Show toast after star lands
    setTimeout(() => {
      setParticles(p => p.filter(x => x.id !== id));
      setToastVisible(true);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastVisible(false), 2800);
    }, 700);
  }, []);

  return (
    <FlyContext.Provider value={{ fly }}>
      {children}
      {particles.map(p => <FlyParticle key={p.id} {...p} />)}
      <SavedToast visible={toastVisible} />
    </FlyContext.Provider>
  );
}

export const useFly = () => useContext(FlyContext);
