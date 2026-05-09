import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, BookMarked, Star, Download } from 'lucide-react';

const STORAGE_KEY = 'prepedge_important_bank';

export function getBank() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
export function saveToBank(q) {
  const bank = getBank();
  if (bank.find(x => x.question === q.question)) return false;
  bank.unshift({ ...q, savedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
  return true;
}
export function removeFromBank(question) {
  const bank = getBank().filter(x => x.question !== question);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
}
export function isInBank(question) {
  return getBank().some(x => x.question === question);
}

function BankCard({ q, index, onRemove }) {
  const [open, setOpen] = useState(false);
  const diff = q.difficulty?.toLowerCase();
  const badge = diff === 'easy' ? 'badge-easy' : diff === 'hard' ? 'badge-hard' : 'badge-medium';
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', animation: 'card-in 0.3s ease both', animationDelay: `${Math.min(index * 40, 400)}ms` }}>
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>{index + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${badge}`}>{q.difficulty || 'Medium'}</span>
            {q.topic && <span style={{ fontSize: '0.72rem', color: 'var(--text-400)', background: 'var(--bg-700)', padding: '2px 8px', borderRadius: 999 }}>{q.topic}</span>}
          </div>
          <p style={{ fontSize: '0.92rem', fontWeight: 500, lineHeight: 1.55, color: 'var(--text-100)' }}>{q.question}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onRemove(q.question); }} title="Remove" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', color: '#f87171', display: 'flex', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          ><Trash2 size={13} /></button>
          <div style={{ color: 'var(--text-400)' }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 20px 20px', paddingLeft: 64, borderTop: '1px solid var(--border)' }}>
          <div style={{ marginTop: 14, background: 'var(--bg-700)', borderRadius: 10, padding: '14px 18px', border: '1px solid rgba(6,182,212,0.15)' }}>
            <div style={{ fontSize: '0.7rem', color: '#06b6d4', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Model Answer</div>
            <p style={{ color: 'var(--text-200)', fontSize: '0.875rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{q.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImportantBankPage() {
  const [bank, setBank] = useState([]);
  const [filter, setFilter] = useState('all');

  const reload = () => setBank(getBank());
  useEffect(() => { reload(); }, []);

  const handleRemove = (question) => { removeFromBank(question); reload(); };

  const filtered = filter === 'all' ? bank : bank.filter(q => q.difficulty?.toLowerCase() === filter);
  const easyC = bank.filter(q => q.difficulty?.toLowerCase() === 'easy').length;
  const medC  = bank.filter(q => q.difficulty?.toLowerCase() === 'medium').length;
  const hardC = bank.filter(q => q.difficulty?.toLowerCase() === 'hard').length;

  const exportTxt = () => {
    const text = bank.map((q, i) => `Q${i+1} [${q.difficulty}] ${q.topic ? `(${q.topic})` : ''}\n${q.question}\n\nAnswer:\n${q.answer}\n\n${'─'.repeat(60)}\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'important-questions.txt'; a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-900)', paddingTop: 80 }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-800)', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
                <Star size={22} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Important <span style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Bank</span>
                </h1>
                <p style={{ color: 'var(--text-400)', fontSize: '0.8rem' }}>Your bookmarked questions for quick revision</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {bank.length > 0 && (
                <>
                  <span className="badge badge-easy">{easyC} Easy</span>
                  <span className="badge badge-medium">{medC} Med</span>
                  <span className="badge badge-hard">{hardC} Hard</span>
                  <button onClick={exportTxt} className="btn btn-outline btn-sm" style={{ gap: 6 }}>
                    <Download size={13} /> Export
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {bank.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 24px' }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <BookMarked size={32} color="#f59e0b" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 10 }}>Your bank is empty</h2>
            <p style={{ color: 'var(--text-300)', fontSize: '0.9rem', maxWidth: 380, margin: '0 auto 28px' }}>
              Head to the Dashboard, generate questions, then click the <Star size={13} style={{ display: 'inline', verticalAlign: 'middle', color: '#f59e0b' }} /> icon to save important ones here.
            </p>
            <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {[['all', `All (${bank.length})`], ['easy', `Easy (${easyC})`], ['medium', `Medium (${medC})`], ['hard', `Hard (${hardC})`]].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{ padding: '7px 18px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all 0.2s', background: filter === val ? 'rgba(124,58,237,0.15)' : 'transparent', borderColor: filter === val ? 'rgba(139,92,246,0.5)' : 'var(--border)', color: filter === val ? '#a78bfa' : 'var(--text-300)' }}>
                  {label}
                </button>
              ))}
              <button onClick={() => { if (window.confirm('Clear all saved questions?')) { localStorage.removeItem(STORAGE_KEY); reload(); } }} style={{ marginLeft: 'auto', padding: '7px 16px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#f87171', transition: 'all 0.2s' }}>
                Clear All
              </button>
            </div>

            {filtered.length === 0 ? (
              <p style={{ color: 'var(--text-400)', textAlign: 'center', padding: '40px 0' }}>No {filter} questions saved.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map((q, i) => <BankCard key={q.question} q={q} index={i} onRemove={handleRemove} />)}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes card-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
