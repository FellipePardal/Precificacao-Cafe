import React from 'react';

const cfg = {
  ok:     { cls: 'border-accent2 text-accent2 bg-accent2-light' },
  warn:   { cls: 'border-warn   text-warn   bg-warn-light' },
  danger: { cls: 'border-danger text-danger bg-danger-light' },
};

export default function AlertBox({ alerts }) {
  if (!alerts?.length) return null;
  return (
    <div className="space-y-2 animate-fade-up delay-6">
      {alerts.map((a, i) => (
        <div key={i} className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border-l-2 ${(cfg[a.type] || cfg.warn).cls}`}>
          <p className="text-sm">{a.message}</p>
        </div>
      ))}
    </div>
  );
}
