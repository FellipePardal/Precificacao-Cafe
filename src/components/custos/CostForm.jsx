import React from 'react';
import { useCosts } from '../../hooks/useCosts';
import { useEmployees } from '../../hooks/useEmployees';
import { useCostsStore, prevYM, nextYM, ymLabel, ymNow } from '../../store/costsStore';
import { formatBRL } from '../../utils/formatters';

const inputCls = 'flex-1 px-3 py-2.5 text-sm text-dark bg-white focus:outline-none tabular-nums';
const wrapCls  = 'flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 bg-white';
const prefCls  = 'px-3 py-2.5 text-sm text-muted bg-surface2 border-r border-border font-medium select-none';
const sufCls   = 'px-3 py-2.5 text-sm text-muted bg-surface2 border-l border-border font-medium select-none';
const labelCls = 'text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block';

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
    fixedCosts, variableCosts, rawMaterial, cardFeePercent, revenue, workDays, hoursPerDay, selectedMonth,
    updateFixedCost, updateVariableCost, updateCardFee, updateRevenue, updateWorkDays, updateHoursPerDay,
  } = useCosts();
  const { setSelectedMonth } = useCostsStore();
  const { payroll, employees } = useEmployees();

  const [slideClass, setSlideClass] = React.useState('');

  const currentYM = ymNow();
  const atCurrent = selectedMonth === currentYM;

  function navigate(ym, direction) {
    setSlideClass(direction === 'prev' ? 'animate-slide-left' : 'animate-slide-right');
    setSelectedMonth(ym);
  }

  return (
    <div className="space-y-4">

      {/* Month navigator */}
      <div className="bg-white rounded-xl border border-border px-5 py-4 flex items-center justify-between animate-fade-up">
        <button
          onClick={() => navigate(prevYM(selectedMonth), 'prev')}
          className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-dark"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="text-center">
          <p className="font-serif text-lg text-dark leading-none">{ymLabel(selectedMonth)}</p>
          {atCurrent
            ? <p className="text-[10px] text-accent2 font-semibold uppercase tracking-widest mt-1">Mês atual</p>
            : <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Histórico</p>}
        </div>

        <button
          onClick={() => navigate(nextYM(selectedMonth), 'next')}
          disabled={atCurrent}
          className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-dark disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Animated content — key forces re-mount on month change */}
      <div key={selectedMonth} className={slideClass}>

      {/* Fixed costs */}
      <Section title="Custos Fixos Mensais" delay="delay-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Aluguel"             value={fixedCosts.aluguel}  onChange={(v) => updateFixedCost('aluguel', v)} />

          {/* Folha — read-only, driven by Equipe */}
          <div>
            <label className={labelCls}>Folha + Encargos</label>
            <div className={wrapCls} style={{ opacity: 0.72 }}>
              <span className={prefCls}>R$</span>
              <span className={`${inputCls} flex items-center font-semibold text-dark select-none`}>
                {formatBRL(payroll)}
              </span>
              <span className={sufCls} style={{ fontSize: 10, whiteSpace: 'nowrap' }}>
                {employees.length} func. · Equipe
              </span>
            </div>
          </div>

          <Field label="Energia"             value={fixedCosts.energia}  onChange={(v) => updateFixedCost('energia', v)} />
          <Field label="Água & Gás"          value={fixedCosts.aguaGas}  onChange={(v) => updateFixedCost('aguaGas', v)} />
          <Field label="Internet & Telefone" value={fixedCosts.internet} onChange={(v) => updateFixedCost('internet', v)} />
          <Field label="Outros"              value={fixedCosts.outros}   onChange={(v) => updateFixedCost('outros', v)} />
        </div>
      </Section>

      {/* Variable costs — per supplier */}
      <Section title="Compras & Fornecedores" delay="delay-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Supermercado"          value={variableCosts.mercado}     onChange={(v) => updateVariableCost('mercado', v)} />
          <Field label="Feira"                 value={variableCosts.feira}       onChange={(v) => updateVariableCost('feira', v)} />
          <Field label="Hortifrúti"            value={variableCosts.hortifruti}  onChange={(v) => updateVariableCost('hortifruti', v)} />
          <Field label="Fornecedor Salgados"   value={variableCosts.salgados}    onChange={(v) => updateVariableCost('salgados', v)} />
          <Field label="Fornecedor Doces"      value={variableCosts.doces}       onChange={(v) => updateVariableCost('doces', v)} />
          <Field label="Outros"                value={variableCosts.outros}      onChange={(v) => updateVariableCost('outros', v)} />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
          <span className="text-xs font-semibold text-muted uppercase tracking-widest">Total compras</span>
          <span className="font-serif text-lg text-dark">{formatBRL(rawMaterial)}</span>
        </div>
        <div className="mt-2">
          <Field label="Taxa de Cartão" value={cardFeePercent} onChange={updateCardFee} prefix={null} suffix="%" />
        </div>
      </Section>

      {/* Operation — global, not per-month */}
      <Section title="Operação" delay="delay-3">
        <Field label="Faturamento do Mês (R$)" value={revenue} onChange={updateRevenue} />
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

      </div>{/* end animated content */}
    </div>
  );
}
