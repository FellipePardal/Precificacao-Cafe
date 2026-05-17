import React from 'react';

const cfg = {
  accent:  { top: 'border-t-accent',  lbl: 'text-accent',  val: 'text-accent'  },
  accent2: { top: 'border-t-accent2', lbl: 'text-accent2', val: 'text-accent2' },
  warn:    { top: 'border-t-warn',    lbl: 'text-warn',     val: 'text-warn'   },
  danger:  { top: 'border-t-danger',  lbl: 'text-danger',   val: 'text-danger' },
};

export default function StatCard({ label, value, sub, color = 'accent', delay = 0 }) {
  const c = cfg[color] || cfg.accent;
  return (
    <div className={`bg-white rounded-xl border border-border border-t-2 ${c.top} p-5 card-hover animate-fade-up ${delay ? `delay-${delay}` : ''}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${c.lbl}`}>{label}</p>
      <p className={`font-serif text-[1.75rem] leading-none ${c.val}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-2">{sub}</p>}
    </div>
  );
}
