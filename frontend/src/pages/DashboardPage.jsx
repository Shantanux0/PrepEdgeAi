import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateQuestions, getSupportedTopics } from '../api/apiClient';
import { saveToBank, isInBank } from './ImportantBankPage';
import { useFly } from '../context/FlyContext';
import { Brain, Sparkles, X, ChevronDown, ChevronUp, BookOpen, User, Plus, Search, Star } from 'lucide-react';

/* ── Cinematic generating animation ── */
function GeneratingOverlay({ topic }) {
  const steps = ['Connecting to Groq AI…', `Analysing topic: "${topic}"…`, 'Crafting questions…', 'Grading difficulty…', 'Compiling answers…'];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      {/* Neural ring */}
      <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 32px' }}>
        <svg style={{ position: 'absolute', inset: 0, animation: 'spin 2s linear infinite' }} viewBox="0 0 90 90" width="90" height="90">
          <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="3" />
          <circle cx="45" cy="45" r="40" fill="none" stroke="url(#rg)" strokeWidth="3"
            strokeDasharray="60 191" strokeLinecap="round"
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transformBox: 'fill-box' }} />
          <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
        </svg>
        <svg style={{ position: 'absolute', inset: 10, animation: 'spin-r 1.4s linear infinite' }} viewBox="0 0 70 70" width="70" height="70">
          <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="2" />
          <circle cx="35" cy="35" r="30" fill="none" stroke="#06b6d4" strokeWidth="2"
            strokeDasharray="25 163" strokeLinecap="round" opacity="0.8" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={24} color="#8b5cf6" style={{ animation: 'pulse-b 1.4s ease-in-out infinite' }} />
        </div>
      </div>
      <p style={{ color: 'var(--text-100)', fontSize: '1.05rem', fontWeight: 600, marginBottom: 8 }}>
        Generating with AI
      </p>
      <p style={{ color: '#8b5cf6', fontSize: '0.85rem', fontFamily: 'monospace', minHeight: 22, animation: 'fade-step 0.4s ease', key: step }}>
        {steps[step]}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: `dot-b 1.2s ${i * 0.2}s ease-in-out infinite` }} />
        ))}
      </div>
    </div>
  );
}

/* ── Topic autocomplete ── */
function TopicSearch({ value, onChange, allTopics }) {
  const [focused, setFocused] = useState(false);
  const ref = useRef();

  const raw = value.split(',');
  const current = raw[raw.length - 1].trim().toLowerCase();
  const selected = raw.slice(0, -1).map(s => s.trim()).filter(Boolean);

  const filtered = current.length > 0
    ? allTopics.filter(t => t.toLowerCase().includes(current) && !selected.includes(t)).slice(0, 8)
    : [];

  const pick = (t) => {
    const prev = raw.slice(0, -1).map(s => s.trim()).filter(Boolean);
    if (prev.length < 3) onChange([...prev, t].join(', ') + ', ');
  };

  const parts = value.split(',').map(s => s.trim()).filter(Boolean);
  const canAdd = parts.length < 3;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-400)', pointerEvents: 'none' }} />
        <input
          className="form-input"
          style={{ paddingLeft: 36 }}
          placeholder={canAdd ? 'Type a topic (e.g. react, sql, docker)…' : 'Max 3 topics reached'}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          disabled={!canAdd}
        />
      </div>

      {/* Selected chips */}
      {parts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {parts.map(p => (
            <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(139,92,246,0.35)', fontSize: '0.78rem', color: '#a78bfa' }}>
              {p}
              <button type="button" onClick={() => onChange(parts.filter(x => x !== p).join(', '))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa', padding: 0, display: 'flex' }}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {focused && filtered.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, background: 'var(--bg-700)', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {filtered.map(t => (
            <button key={t} type="button" onMouseDown={() => pick(t)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', color: 'var(--text-200)', fontSize: '0.875rem', cursor: 'pointer', borderBottom: '1px solid rgba(139,92,246,0.08)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{t.slice(0, t.toLowerCase().indexOf(current))}</span>
              <span style={{ background: 'rgba(139,92,246,0.25)', borderRadius: 3 }}>{t.slice(t.toLowerCase().indexOf(current), t.toLowerCase().indexOf(current) + current.length)}</span>
              {t.slice(t.toLowerCase().indexOf(current) + current.length)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Company tags ── */
function CompanyInput({ companies, setCompanies }) {
  const [val, setVal] = useState('');
  const SUGGESTIONS = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Stripe', 'Atlassian', 'Flipkart'];
  const add = n => { const t = n.trim(); if (t && !companies.includes(t) && companies.length < 5) { setCompanies(p => [...p, t]); setVal(''); } };
  const remove = c => setCompanies(p => p.filter(x => x !== c));
  return (
    <div>
      {companies.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {companies.map(c => (
            <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', fontSize: '0.78rem', color: '#06b6d4' }}>
              {c}<button onClick={() => remove(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#06b6d4', padding: 0, display: 'flex' }}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
      <input className="form-input" placeholder="Company name + Enter" value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(val); } }}
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {SUGGESTIONS.filter(s => !companies.includes(s)).map(s => (
          <button key={s} type="button" onClick={() => add(s)} style={{ padding: '3px 10px', borderRadius: 999, background: 'var(--bg-700)', border: '1px solid var(--border)', color: 'var(--text-300)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#8b5cf6'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-300)'; }}
          >{s}</button>
        ))}
      </div>
    </div>
  );
}

/* ── Question card ── */
function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(() => isInBank(q.question));
  const { fly } = useFly();
  const btnRef = useRef(null);
  const diff = q.difficulty?.toLowerCase();
  const badge = diff === 'easy' ? 'badge-easy' : diff === 'hard' ? 'badge-hard' : 'badge-medium';
  const handleSave = (e) => {
    e.stopPropagation();
    if (!saved) {
      saveToBank(q);
      setSaved(true);
      fly(btnRef.current);
    }
  };
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', animation: 'card-in 0.3s ease both', animationDelay: `${Math.min(index * 40, 400)}ms` }} onClick={() => setOpen(o => !o)}>
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6' }}>{index + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${badge}`}>{q.difficulty || 'Medium'}</span>
            {q.topic && <span style={{ fontSize: '0.72rem', color: 'var(--text-400)', background: 'var(--bg-700)', padding: '2px 8px', borderRadius: 999 }}>{q.topic}</span>}
          </div>
          <p style={{ fontSize: '0.92rem', fontWeight: 500, lineHeight: 1.55, color: 'var(--text-100)' }}>{q.question}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexShrink: 0 }}>
          <button ref={btnRef} onClick={handleSave} title={saved ? 'Saved to bank' : 'Save to Important Bank'} style={{ background: saved ? 'rgba(245,158,11,0.15)' : 'transparent', border: `1px solid ${saved ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`, borderRadius: 8, padding: '5px 7px', cursor: saved ? 'default' : 'pointer', color: saved ? '#f59e0b' : 'var(--text-400)', display: 'flex', transition: 'all 0.2s' }}
            onMouseEnter={e => { if (!saved) { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.color = '#f59e0b'; } }}
            onMouseLeave={e => { if (!saved) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-400)'; } }}
          ><Star size={13} fill={saved ? '#f59e0b' : 'none'} /></button>
          <div style={{ color: 'var(--text-400)', marginTop: 2 }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 20px 20px', paddingLeft: 64, borderTop: '1px solid var(--border)', animation: 'fade-in 0.2s ease' }}>
          <div style={{ marginTop: 14, background: 'var(--bg-700)', borderRadius: 10, padding: '14px 18px', border: '1px solid rgba(6,182,212,0.15)' }}>
            <div style={{ fontSize: '0.7rem', color: '#06b6d4', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Model Answer</div>
            <p style={{ color: 'var(--text-200)', fontSize: '0.875rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{q.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Dashboard ── */
const DASH_KEY = 'prepedge_dashboard';
const loadDash = () => { try { return JSON.parse(localStorage.getItem(DASH_KEY) || '{}'); } catch { return {}; } };
const saveDash = (obj) => { try { localStorage.setItem(DASH_KEY, JSON.stringify(obj)); } catch {} };

export default function DashboardPage() {
  const { user } = useAuth();
  const saved = loadDash();
  const [topic, setTopicRaw] = useState(saved.topic || '');
  const [companies, setCompaniesRaw] = useState(saved.companies || []);
  const [questions, setQuestionsRaw] = useState(saved.questions || []);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [allTopics, setAllTopics] = useState([]);
  const [generated, setGenerated] = useState((saved.questions || []).length > 0);
  const resultsRef = useRef();

  // Persisting wrappers
  const setTopic = (v) => { setTopicRaw(v); saveDash({ ...loadDash(), topic: v }); };
  const setCompanies = (v) => { const val = typeof v === 'function' ? v(companies) : v; setCompaniesRaw(val); saveDash({ ...loadDash(), companies: val }); };
  const setQuestions = (v) => { const val = typeof v === 'function' ? v(questions) : v; setQuestionsRaw(val); saveDash({ ...loadDash(), questions: val }); };

  useEffect(() => { getSupportedTopics().then(r => setAllTopics([...r.data].sort())).catch(() => {}); }, []);

  const doGenerate = async (append = false) => {
    const t = topic.split(',').map(s => s.trim()).filter(Boolean).join(', ');
    if (!t) return;
    if (append) setLoadingMore(true); else { setLoading(true); setGenerated(false); setQuestions([]); }
    setError('');
    try {
      const { data } = await generateQuestions(t, companies);
      setQuestions(prev => append ? [...prev, ...data] : data);
      setGenerated(true);
      if (append) setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 200);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to generate questions.');
    } finally { setLoading(false); setLoadingMore(false); }
  };

  const handleSubmit = e => { e.preventDefault(); doGenerate(false); };

  const handleClear = () => {
    setQuestionsRaw([]); setGenerated(false);
    saveDash({ ...loadDash(), questions: [] });
  };

  const easyC = questions.filter(q => q.difficulty?.toLowerCase() === 'easy').length;
  const medC  = questions.filter(q => q.difficulty?.toLowerCase() === 'medium').length;
  const hardC = questions.filter(q => q.difficulty?.toLowerCase() === 'hard').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-900)', paddingTop: 80 }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-800)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="white" /></div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-400)' }}>Signed in as</p>
              <h1 style={{ fontSize: '1rem', fontWeight: 700 }}>{user?.name}</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem' }}>Interview <span className="gradient-text">Dashboard</span></span>
          </div>
          {generated && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge badge-easy">{easyC} Easy</span>
              <span className="badge badge-medium">{medC} Med</span>
              <span className="badge badge-hard">{hardC} Hard</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginLeft: 4 }}>{questions.length} total</span>
              <button onClick={handleClear} style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', marginLeft: 4, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              >Clear</button>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }} className="dash-grid">

          {/* ── Left panel ── */}
          <div className="card sticky-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={15} color="#8b5cf6" /></div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Generate Questions</h2>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: 14, fontSize: '0.85rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Topics <span style={{ color: 'var(--text-400)', fontWeight: 400 }}>(up to 3)</span></label>
                <TopicSearch value={topic} onChange={setTopic} allTopics={allTopics} />
                {allTopics.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-400)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 88, overflow: 'auto' }}>
                      {['react', 'node.js', 'python', 'java', 'spring boot', 'machine learning', 'system design', 'sql', 'docker', 'aws', 'data structures', 'algorithms'].map(t => {
                        const parts = topic.split(',').map(s => s.trim()).filter(Boolean);
                        const selected = parts.includes(t);
                        return (
                          <button key={t} type="button" disabled={selected || parts.length >= 3} onClick={() => {
                            if (!selected && parts.length < 3) setTopic([...parts, t].join(', '));
                          }} style={{ padding: '3px 9px', borderRadius: 999, background: selected ? 'rgba(124,58,237,0.2)' : 'var(--bg-700)', border: `1px solid ${selected ? 'rgba(139,92,246,0.5)' : 'var(--border)'}`, color: selected ? '#a78bfa' : 'var(--text-300)', fontSize: '0.72rem', cursor: selected ? 'default' : 'pointer', transition: 'all 0.15s', opacity: parts.length >= 3 && !selected ? 0.4 : 1 }}>{t}</button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Target Companies <span style={{ color: 'var(--text-400)', fontWeight: 400 }}>(optional)</span></label>
                <CompanyInput companies={companies} setCompanies={setCompanies} />
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading || loadingMore || !topic.trim()} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                {loading ? <><div className="spinner" /> Generating…</> : <><Brain size={15} /> Generate Questions</>}
              </button>
            </form>

            <div style={{ marginTop: 18, padding: '13px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 10 }}>
              <p style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 700, marginBottom: 10 }}>💡 TIPS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[`Search from ${allTopics.length}+ supported topics`, 'Select up to 3 topics at once', 'Use Generate 10 More to keep adding questions', 'Click any card to reveal the model answer'].map(tip => (
                  <div key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#06b6d4', flexShrink: 0, marginTop: 6 }} />
                    <span style={{ color: 'var(--text-300)', fontSize: '0.78rem', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div ref={resultsRef}>
            {!generated && !loading && (
              <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                <div style={{ width: 68, height: 68, borderRadius: 18, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <BookOpen size={26} color="#8b5cf6" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8 }}>Ready to prepare?</h3>
                <p style={{ color: 'var(--text-300)', fontSize: '0.875rem', maxWidth: 340, margin: '0 auto' }}>
                  Search a topic on the left and click Generate. Questions appear here instantly.
                </p>
              </div>
            )}

            {loading && <GeneratingOverlay topic={topic.split(',')[0]?.trim() || topic} />}

            {generated && questions.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    <span className="gradient-text">{questions.length} Question{questions.length !== 1 ? 's' : ''}</span> Generated
                  </h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-easy">{easyC} Easy</span>
                    <span className="badge badge-medium">{medC} Med</span>
                    <span className="badge badge-hard">{hardC} Hard</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {questions.map((q, i) => <QuestionCard key={`${q.id || ''}-${i}`} q={q} index={i} />)}
                </div>

                {/* Generate More button */}
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  {loadingMore ? (
                    <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-300)' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6', animation: 'spin 0.7s linear infinite' }} />
                      <span style={{ fontSize: '0.9rem' }}>Generating 10 more…</span>
                    </div>
                  ) : (
                    <button className="btn btn-outline" onClick={() => doGenerate(true)} disabled={loadingMore} style={{ gap: 8 }}>
                      <Plus size={15} /> Generate 10 More
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-400)', marginLeft: 2 }}>→ {questions.length + 10} total</span>
                    </button>
                  )}
                  <p style={{ color: 'var(--text-400)', fontSize: '0.78rem', marginTop: 8 }}>
                    Questions accumulate. Keep generating until you feel confident.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){.dash-grid{grid-template-columns:1fr!important}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spin-r{to{transform:rotate(-360deg)}}
        @keyframes pulse-b{0%,100%{opacity:0.7;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
        @keyframes dot-b{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}
        @keyframes fade-step{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @keyframes card-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes fade-in{from{opacity:0}to{opacity:1}}
      `}</style>
    </div>
  );
}
