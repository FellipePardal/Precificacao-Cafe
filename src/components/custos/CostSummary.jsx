import React from 'react';
import { useCosts } from '../../hooks/useCosts';
import { ymLabel } from '../../store/costsStore';
import { formatBRL } from '../../utils/formatters';

function Item({ label, value, highlight }) {
  return (
    <div className={`rounded-lg px-4 py-3 flex justify-between items-center ${highlight ? 'bg-accent text-white' : 'bg-surface2'}`}>
      <p className={`text-xs font-medium ${highlight ? 'text-white/70' : 'text-muted'}`}>{label}</p>
      <p className={`font-serif text-lg leading-none ${highlight ? 'text-white' : 'text-dark'}`}>{value}</p>
    </div>
  );
}

export default function CostSummary() {
  const { totalFixed, rawMaterial, totalMonthlyCost, costPerMin, selectedMonth, payroll } = useCosts();
  return (
    <div className="bg-white rounded-xl border border-border p-5 animate-fade-up delay-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-base text-dark">Resumo</h3>
        <span className="text-xs font-semibold text-muted bg-surface2 px-2.5 py-1 rounded-full">{ymLabel(selectedMonth)}</span>
      </div>
      <div className="space-y-2">
        <Item label="Custos Fixos"      value={formatBRL(totalFixed)} />
        <Item label="· Folha"           value={formatBRL(payroll)} />
        <Item label="Matéria-Prima"     value={formatBRL(rawMaterial)} />
        <Item label="Total Mensal"      value={formatBRL(totalMonthlyCost)} highlight />
        <Item label="Custo / Hora"      value={formatBRL(costPerMin * 60)} />
        <Item label="Custo / Minuto"    value={formatBRL(costPerMin)} />
      </div>
    </div>
  );
}
