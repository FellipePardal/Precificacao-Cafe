import React from 'react';
import { formatBRL } from '../../utils/formatters';

const labels = {
  aluguel:  'Aluguel',
  folha:    'Folha + Encargos',
  energia:  'Energia',
  aguaGas:  'Água & Gás',
  internet: 'Internet & Tel.',
  outros:   'Outros',
};

export default function CostBreakdown({ costs }) {
  const total = Object.values(costs).reduce((s, v) => s + v, 0);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-up delay-5">
      <h2 className="font-serif text-base text-dark mb-4">Custos Fixos</h2>
      <div className="space-y-3">
        {Object.entries(costs).map(([key, value]) => {
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted">{labels[key] || key}</span>
                <span className="text-xs font-medium text-dark tabular-nums">{formatBRL(value)}</span>
              </div>
              <div className="h-1 bg-surface2 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-border flex justify-between">
        <span className="text-sm text-muted">Total</span>
        <span className="font-serif text-lg text-dark">{formatBRL(total)}</span>
      </div>
    </div>
  );
}
