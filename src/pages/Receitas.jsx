import React from 'react';
import { useCosts } from '../hooks/useCosts';
import { useCostsStore, prevYM, nextYM, ymLabel, ymNow } from '../store/costsStore';
import { formatBRL } from '../utils/formatters';

const inputCls  = 'flex-1 px-3 py-2.5 text-sm text-dark bg-white focus:outline-none tabular-nums';
const wrapCls   = 'flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 bg-white';
const prefCls   = 'px-3 py-2.5 text-sm text-muted bg-surface2 border-r border-border font-medium select-none';
const sufCls    = 'px-3 py-2.5 text-sm text-muted bg-surface2 border-l border-border font-medium select-none';
const labelCls  = 'text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block';

function Field({ label, value, onChange, suffix, prefix = 'R$' }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className={wrapCls}>
        {prefix && <span className={prefCls}>{prefix}</span>}
        <input
          type="number" min="0" step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
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

function KpiCard({ label, value, sub, color = 'bg-surface2', textColor = 'text-dark' }) {
  return (
    <div className={`rounded-xl p-5 flex flex-col gap-1 ${color}`}>
      <p className="text-xs font-semibold text-muted uppercase tracking-widest">{label}</p>
      <p className={`font-serif text-2xl leading-none ${textColor}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function Receitas() {
  const {
    revenue, cardFeePercent, workDays, hoursPerDay, selectedMonth,
    updateRevenue, updateCardFee, updateWorkDays, updateHoursPerDay,
    totalFixed, totalMonthlyCost, rawMaterial,
  } = useCosts();

  const { setSelectedMonth } = useCostsStore();
  const [slideClass, setSlideClass] = React.useState('');

  const currentYM = ymNow();
  const atCurrent = selectedMonth === currentYM;

  function navigate(ym, direction) {
    setSlideClass(direction === 'prev' ? 'animate-slide-left' : 'animate-slide-right');
    setSelectedMonth(ym);
  }

  const cardFeeValue   = revenue * (cardFeePercent / 100);
  const netRevenue     = revenue - cardFeeValue;
  const resultado      = netRevenue - totalMonthlyCost;
  const margemReal     = revenue > 0 ? (resultado / revenue) * 100 : 0;
  const totalHoras     = workDays * hoursPerDay;

  const resultadoColor = resultado >= 0 ? 'text-accent' : 'text-red-600';
  const resultadoBg    = resultado >= 0 ? 'bg-accent text-white' : 'bg-red-50';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="font-serif text-2xl text-dark">Receitas e Entradas</h1>
        <p className="text-sm text-muted mt-1">Faturamento mensal e parâmetros de operação</p>
      </div>

      {/* Month navigator */}
      <div className="bg-white rounded-xl border border-border px-5 py-4 flex items-center justify-between mb-4 animate-fade-up">
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

      <div key={selectedMonth} className={slideClass}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">

            <Section title="Faturamento" delay="delay-1">
              <Field
                label="Faturamento Bruto do Mês"
                value={revenue}
                onChange={updateRevenue}
              />
              <Field
                label="Taxa de Cartão"
                value={cardFeePercent}
                onChange={updateCardFee}
                prefix={null}
                suffix="%"
              />
              <div className="rounded-lg bg-surface2 px-4 py-3 flex justify-between items-center">
                <p className="text-xs font-medium text-muted">Taxa de cartão (valor)</p>
                <p className="font-serif text-base text-dark">− {formatBRL(cardFeeValue)}</p>
              </div>
              <div className="rounded-lg bg-accent px-4 py-3 flex justify-between items-center">
                <p className="text-xs font-medium text-white/70">Receita Líquida</p>
                <p className="font-serif text-lg text-white">{formatBRL(netRevenue)}</p>
              </div>
            </Section>

            <Section title="Parâmetros de Operação" delay="delay-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Dias Trabalhados/mês</label>
                  <input
                    type="number" min="1" max="31"
                    value={workDays}
                    onChange={(e) => updateWorkDays(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 tabular-nums"
                  />
                </div>
                <div>
                  <label className={labelCls}>Horas por Dia</label>
                  <input
                    type="number" min="1" max="24"
                    value={hoursPerDay}
                    onChange={(e) => updateHoursPerDay(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 tabular-nums"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-surface2 px-4 py-3 flex justify-between items-center">
                <p className="text-xs font-medium text-muted">Total de horas/mês</p>
                <p className="font-serif text-base text-dark">{totalHoras}h</p>
              </div>
            </Section>

          </div>

          {/* Right column — KPIs */}
          <div className="space-y-4 animate-fade-up delay-2">
            <KpiCard
              label="Faturamento Bruto"
              value={formatBRL(revenue)}
              sub={`Taxa cartão: ${cardFeePercent}% = − ${formatBRL(cardFeeValue)}`}
            />
            <KpiCard
              label="Custos Totais"
              value={formatBRL(totalMonthlyCost)}
              sub={`Fixos: ${formatBRL(totalFixed)} · Variáveis: ${formatBRL(rawMaterial)}`}
            />
            <div className={`rounded-xl p-5 flex flex-col gap-1 ${resultado >= 0 ? 'bg-accent' : 'bg-red-500'}`}>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                {resultado >= 0 ? 'Resultado do Mês' : 'Prejuízo do Mês'}
              </p>
              <p className="font-serif text-2xl leading-none text-white">{formatBRL(Math.abs(resultado))}</p>
              <p className="text-[11px] text-white/60 mt-1">
                Margem real: {margemReal.toFixed(1)}%
                {resultado >= 0 ? ' · Operação positiva' : ' · Atenção: abaixo do ponto de equilíbrio'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-serif text-base text-dark mb-3">Horas de Operação</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Dias/mês</span>
                  <span className="font-medium text-dark tabular-nums">{workDays} dias</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Horas/dia</span>
                  <span className="font-medium text-dark tabular-nums">{hoursPerDay}h</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-sm">
                  <span className="text-muted">Total mensal</span>
                  <span className="font-semibold text-dark tabular-nums">{totalHoras}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Receita/hora</span>
                  <span className="font-semibold text-accent tabular-nums">
                    {totalHoras > 0 ? formatBRL(revenue / totalHoras) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
