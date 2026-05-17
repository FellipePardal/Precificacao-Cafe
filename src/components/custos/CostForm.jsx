import React from 'react';
import { useCosts } from '../../hooks/useCosts';

const inputCls = "flex-1 px-3 py-2.5 text-sm text-dark bg-white focus:outline-none tabular-nums";
const wrapCls  = "flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 bg-white";
const prefCls  = "px-3 py-2.5 text-sm text-muted bg-surface2 border-r border-border font-medium select-none";
const sufCls   = "px-3 py-2.5 text-sm text-muted bg-surface2 border-l border-border font-medium select-none";
const labelCls = "text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block";

function Field({ label, value, onChange, suffix, prefix = 'R$' }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className={wrapCls}>
        {prefix && <span className={prefCls}>{prefix}</span>}
        <input type="number" min="0" step="0.01" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        {suffix && <span className={sufCls}>{suffix}</span>}
      </div>
    </div>
  );
}

function Section({ title, children, delay = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-border p-5 animate-fade-up ${delay}`}>
      <h3 className="font-serif text-base text-dark mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function CostForm() {
  const {
    fixedCosts, rawMaterial, cardFeePercent, revenue, workDays, hoursPerDay,
    updateFixedCost, updateRawMaterial, updateCardFee, updateRevenue, updateWorkDays, updateHoursPerDay,
  } = useCosts();

  return (
    <div className="space-y-4">
      <Section title="Custos Fixos Mensais" delay="delay-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Aluguel"             value={fixedCosts.aluguel}  onChange={(v) => updateFixedCost('aluguel', v)} />
          <Field label="Folha + Encargos"    value={fixedCosts.folha}    onChange={(v) => updateFixedCost('folha', v)} />
          <Field label="Energia"             value={fixedCosts.energia}  onChange={(v) => updateFixedCost('energia', v)} />
          <Field label="Água & Gás"          value={fixedCosts.aguaGas}  onChange={(v) => updateFixedCost('aguaGas', v)} />
          <Field label="Internet & Telefone" value={fixedCosts.internet} onChange={(v) => updateFixedCost('internet', v)} />
          <Field label="Taxas Delivery"      value={fixedCosts.delivery} onChange={(v) => updateFixedCost('delivery', v)} />
          <Field label="Outros"              value={fixedCosts.outros}   onChange={(v) => updateFixedCost('outros', v)} />
        </div>
      </Section>

      <Section title="Custos Variáveis" delay="delay-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Matéria-Prima Mensal" value={rawMaterial}     onChange={updateRawMaterial} />
          <Field label="Taxa de Cartão"       value={cardFeePercent}  onChange={updateCardFee} prefix={null} suffix="%" />
        </div>
      </Section>

      <Section title="Operação" delay="delay-3">
        <Field label="Faturamento Atual (R$/mês)" value={revenue} onChange={updateRevenue} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Dias Trabalhados/mês</label>
            <input type="number" min="1" max="31" value={workDays} onChange={(e) => updateWorkDays(e.target.value)}
              className="border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 tabular-nums" />
          </div>
          <div>
            <label className={labelCls}>Horas por Dia</label>
            <input type="number" min="1" max="24" value={hoursPerDay} onChange={(e) => updateHoursPerDay(e.target.value)}
              className="border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 tabular-nums" />
          </div>
        </div>
      </Section>
    </div>
  );
}
