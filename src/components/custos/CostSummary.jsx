import React from 'react';
import { NavLink } from 'react-router-dom';
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

export default function CostSummary() {
  const { totalFixed, rawMaterial, totalMonthlyCost, costPerMin, selectedMonth, payroll } = useCosts();

  return (
    <div className="bg-white rounded-xl border border-border p-5 animate-fade-up delay-1 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base text-dark">Resumo</h3>
        <span className="text-xs font-semibold text-muted bg-surface2 px-2.5 py-1 rounded-full">{ymLabel(selectedMonth)}</span>
      </div>

      <div className="space-y-2">
        <Item label="Custos Fixos"   value={formatBRL(totalFixed)}       sub={`Folha: ${formatBRL(payroll)}`} />
        <Item label="Total Mensal"   value={formatBRL(totalMonthlyCost)} highlight />
        <Item label="Custo / Hora"   value={formatBRL(costPerMin * 60)} />
        <Item label="Custo / Minuto" value={formatBRL(costPerMin)} />
      </div>

      {/* Link to variable costs */}
      <NavLink
        to="/compras"
        className="flex items-center justify-between rounded-lg px-4 py-3 bg-surface2 hover:bg-accent-light transition-colors group"
      >
        <div>
          <p className="text-xs font-medium text-muted group-hover:text-accent transition-colors">Compras & Fornecedores</p>
          <p className="text-[10px] text-light mt-0.5">Ver detalhes</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg text-dark group-hover:text-accent transition-colors">{formatBRL(rawMaterial)}</span>
          <svg className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </NavLink>
    </div>
  );
}
