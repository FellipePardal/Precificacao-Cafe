import React from 'react';
import { useCosts } from '../../hooks/useCosts';
import { ymLabel } from '../../store/costsStore';
import { formatBRL } from '../../utils/formatters';

function Item({ label, value, highlight, sub }) {
  return (
    <div className={`rounded-lg px-4 py-3 flex justify-between items-center ${highlight ? 'bg-accent text-white' : 'bg-surface2'}`}>
      <div>
        <p className={`text-xs font-medium ${highlight ? 'text-white/70' : 'text-muted'}`}>{label}</p>
        {sub && <p className={`text-[10px] mt-0.5 ${highlight ? 'text-white/50' : 'text-light'}`}>{sub}</p>}
      </div>
      <p className={`font-serif text-lg leading-none ${highlight ? 'text-white' : 'text-dark'}`}>{value}</p>
    </div>
  );
}

const VARIABLE_LABELS = {
  mercado:    'Supermercado',
  feira:      'Feira',
  hortifruti: 'Hortifrúti',
  salgados:   'Salgados',
  doces:      'Doces',
  outros:     'Outros',
};

export default function CostSummary() {
  const { totalFixed, rawMaterial, variableCosts, totalMonthlyCost, costPerMin, selectedMonth, payroll } = useCosts();

  const variableEntries = Object.entries(variableCosts || {}).filter(([, v]) => v > 0);

  return (
    <div className="bg-white rounded-xl border border-border p-5 animate-fade-up delay-1 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base text-dark">Resumo</h3>
        <span className="text-xs font-semibold text-muted bg-surface2 px-2.5 py-1 rounded-full">{ymLabel(selectedMonth)}</span>
      </div>

      <div className="space-y-2">
        <Item label="Custos Fixos" value={formatBRL(totalFixed)} sub={`Folha: ${formatBRL(payroll)}`} />
        <Item label="Total Mensal" value={formatBRL(totalMonthlyCost)} highlight />
        <Item label="Custo / Hora"    value={formatBRL(costPerMin * 60)} />
        <Item label="Custo / Minuto"  value={formatBRL(costPerMin)} />
      </div>

      {/* Variable cost breakdown */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Compras & Fornecedores</p>
          <p className="text-sm font-semibold text-dark">{formatBRL(rawMaterial)}</p>
        </div>
        <div className="space-y-1.5">
          {variableEntries.map(([key, value]) => {
            const pct = rawMaterial > 0 ? (value / rawMaterial) * 100 : 0;
            return (
              <div key={key}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs text-muted">{VARIABLE_LABELS[key] || key}</span>
                  <span className="text-xs font-medium text-dark tabular-nums">{formatBRL(value)}</span>
                </div>
                <div className="h-1 bg-surface2 rounded-full overflow-hidden">
                  <div className="h-full bg-accent2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
