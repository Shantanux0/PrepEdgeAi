import React, { useEffect, useRef, useState } from 'react';

/* ── Particle canvas ── */
function Particles() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.3,
      o: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const opacity = p.o * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50,50,50,${opacity})`;
        ctx.fill();
      });

      // Draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,0,0,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
}

/* ── Animated logo mark ── */
function LogoMark({ progress }) {
  const ring1 = progress * 360;
  const ring2 = Math.min(progress * 2, 1) * 360;

  return (
    <div className="logo-mark-wrapper" style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 32px' }}>
      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: -20, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
        animation: 'pulse-glow 2s ease-in-out infinite',
      }} />

      {/* Spinning ring 1 */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animation: 'spin-cw 3s linear infinite' }} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="54" fill="none"
          stroke="url(#grad1)" strokeWidth="2.5"
          strokeDasharray={`${ring1 / 360 * 339.3} 339.3`}
          strokeLinecap="round"
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transformBox: 'fill-box' }}
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>

      {/* Spinning ring 2 (opposite) */}
      <svg style={{ position: 'absolute', inset: 10, width: 'calc(100% - 20px)', height: 'calc(100% - 20px)', animation: 'spin-ccw 2s linear infinite' }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(30,30,30,0.15)" strokeWidth="1" />
        <circle cx="50" cy="50" r="44" fill="none"
          stroke="#7c3aed" strokeWidth="1.5"
          strokeDasharray="20 256.6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      {/* Center icon */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(124,58,237,0.5)',
          animation: 'logo-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          {/* Brain SVG */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
            <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
            <path d="M6 18a4 4 0 0 1-1.967-.516"/>
            <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Progress bar ── */
function ProgressBar({ progress }) {
  return (
    <div style={{ width: 280, margin: '0 auto' }}>
      <div style={{
        height: 3, background: 'rgba(0,0,0,0.15)', borderRadius: 999,
        overflow: 'hidden', marginBottom: 12,
      }}>
        <div style={{
          height: '100%', borderRadius: 999,
          background: 'linear-gradient(90deg, #7c3aed, #6d28d9)',
          width: `${progress * 100}%`,
          boxShadow: '0 0 12px rgba(124,58,237,0.6)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
          INITIALIZING
        </span>
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', fontWeight: 600 }}>
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}

/* ── Status messages ── */
const STATUS_STEPS = [
  { at: 0.0,  msg: 'Booting AI engine…' },
  { at: 0.2,  msg: 'Connecting to Groq API…' },
  { at: 0.4,  msg: 'Loading interview modules…' },
  { at: 0.6,  msg: 'Calibrating LLM responses…' },
  { at: 0.75, msg: 'Preparing your workspace…' },
  { at: 0.9,  msg: 'Almost ready…' },
];

/* ── Main SplashScreen ── */
export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let current = 0;
    // Tuned for exactly ~4s total: 2.9s progress + 0.6s pause + 0.5s fade
    const speeds = [
      { upto: 0.40, rate: 0.008  },   // 0–40%  → ~800ms  (fast start)
      { upto: 0.75, rate: 0.0038 },   // 40–75% → ~1.47s  (cinematic slow middle)
      { upto: 0.95, rate: 0.006  },   // 75–95% → ~530ms  (picks up)
      { upto: 1.0,  rate: 0.012  },   // 95–100%→ ~67ms   (snaps to 100%)
    ];

    const tick = () => {
      const speed = speeds.find(s => current < s.upto)?.rate ?? 0.012;
      current = Math.min(current + speed, 1);
      setProgress(current);

      const step = [...STATUS_STEPS].reverse().find(s => current >= s.at);
      if (step) setStatusIdx(STATUS_STEPS.indexOf(step));

      if (current < 1) {
        setTimeout(tick, 16);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 500);
        }, 600);
      }
    };
    const timer = setTimeout(tick, 50);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-wrapper" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(30,30,30,0.1) 0%, transparent 50%), #050508',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
      userSelect: 'none',
      padding: '0 24px',
    }}>
      <Particles />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', animation: 'splash-in 0.8s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        {/* Logo */}
        <LogoMark progress={progress} />

        {/* Brand name */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{
            fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px',
            fontFamily: 'Space Grotesk, sans-serif',
            background: 'linear-gradient(135deg, #ffffff 30%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1.1,
          }}>
            Prep<span style={{ WebkitTextFillColor: '#7c3aed' }}>Edge</span>
          </h1>
          <div style={{ marginTop: 12 }}>
            <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed', animation: 'blink 2s ease-in-out infinite' }} />
              AI INTERVIEW PREP
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 40 }}>
          Powered by Groq & Llama 3
        </p>

        {/* Progress */}
        <ProgressBar progress={progress} />

        {/* Status text */}
        <div style={{ height: 28, marginTop: 16 }}>
          <p key={statusIdx} style={{
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)',
            fontFamily: 'monospace', letterSpacing: '0.05em',
            animation: 'fade-status 0.3s ease',
          }}>
            {STATUS_STEPS[statusIdx]?.msg}
          </p>
        </div>
      </div>

      {/* Corner decoration */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 1 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: '50%',
            background: `rgba(0,0,0,${0.3 + i * 0.2})`,
            animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes spin-ccw { to { transform: rotate(-360deg); } }
        @keyframes pulse-glow {
          0%,100% { opacity: 0.6; transform: scale(1);   }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes logo-pop {
          from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1)   rotate(0deg);   }
        }
        @keyframes splash-in {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        @keyframes dot-bounce {
          0%,80%,100% { transform: translateY(0);   }
          40%          { transform: translateY(-8px); }
        }
        @keyframes fade-status {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @media (max-width: 600px) {
          .splash-wrapper h1 { font-size: 2rem !important; }
          .logo-mark-wrapper { transform: scale(0.8); margin-bottom: 20px !important; }
        }
      `}</style>
    </div>
  );
}
