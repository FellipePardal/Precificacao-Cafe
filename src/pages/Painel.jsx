import React from 'react';
import { useCosts } from '../hooks/useCosts';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/painel/StatCard';
import CostBreakdown from '../components/painel/CostBreakdown';
import HealthIndicators from '../components/painel/HealthIndicators';
import AlertBox from '../components/painel/AlertBox';
import { formatBRL, formatPct } from '../utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function buildAlerts({ cmv, folhaPct, margem, faturamento, breakEvenValue }) {
  const alerts = [];
  if (faturamento >= breakEvenValue) {
    alerts.push({ type: 'ok', message: `Faturamento acima do ponto de equilíbrio (${formatBRL(breakEvenValue)}). Ótimo!` });
  } else {
    alerts.push({ type: 'danger', message: `Faturamento abaixo do ponto de equilíbrio (${formatBRL(breakEvenValue)}). Revise preços ou reduza custos.` });
  }
  if (cmv > 45) alerts.push({ type: 'danger', message: `CMV de ${formatPct(cmv)} está crítico. Ideal: abaixo de 35%.` });
  else if (cmv > 35) alerts.push({ type: 'warn', message: `CMV de ${formatPct(cmv)} está elevado. Tente reduzir para menos de 35%.` });
  if (folhaPct > 40) alerts.push({ type: 'danger', message: `Folha representa ${formatPct(folhaPct)} do faturamento — acima do ideal de 25–30%.` });
  else if (folhaPct > 30) alerts.push({ type: 'warn', message: `Folha em ${formatPct(folhaPct)}. Ideal: 25–30%.` });
  if (margem < 25) alerts.push({ type: 'danger', message: `Margem de ${formatPct(margem)} está baixa. Meta: 40%.` });
  else if (margem < 40) alerts.push({ type: 'warn', message: `Margem de ${formatPct(margem)} abaixo da meta de 40%.` });
  return alerts;
}

const PIE_COLORS = ['#6B3E1E', '#286044', '#9B6F10', '#B03030'];

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl px-3 py-2 shadow text-xs">
      <p className="font-medium text-dark">{payload[0].name}</p>
      <p className="text-muted mt-0.5">{formatBRL(payload[0].value)}</p>
      <p className="text-light">{formatPct(payload[0].payload.pct)}</p>
    </div>
  );
}

export default function Painel() {
  const { fixedCosts, payroll, cardFeePercent, revenue, totalFixed, rawMaterial, totalMonthlyCost, cmv, breakEvenValue } = useCosts();

  const folhaPct = revenue > 0 ? (payroll / revenue) * 100 : 0;
  const cardFee  = revenue * cardFeePercent / 100;
  const lucro    = revenue - totalMonthlyCost - cardFee;
  const margem   = revenue > 0 ? (lucro / revenue) * 100 : 0;
  const alerts   = buildAlerts({ cmv, folhaPct, margem, faturamento: revenue, breakEvenValue });

  const breakdownCosts = { ...fixedCosts, folha: payroll };

  const pieData = [
    { name: 'Custos Fixos',   value: totalFixed,    pct: revenue > 0 ? (totalFixed / revenue) * 100 : 0 },
    { name: 'Compras',        value: rawMaterial,   pct: revenue > 0 ? (rawMaterial / revenue) * 100 : 0 },
    { name: 'Taxa Cartão',    value: cardFee,       pct: revenue > 0 ? (cardFee / revenue) * 100 : 0 },
    { name: 'Lucro',          value: Math.max(0, lucro), pct: Math.max(0, margem) },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <PageHeader title="Painel Geral" subtitle="Visão financeira do seu negócio" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Lucro Estimado"    value={formatBRL(lucro)}           sub={`${formatPct(margem)} de margem`}              color={margem >= 40 ? 'accent2' : margem >= 25 ? 'warn' : 'danger'} delay={1} />
        <StatCard label="Custo Total"       value={formatBRL(totalMonthlyCost)} sub={`Fixos: ${formatBRL(totalFixed)}`}             color="accent"  delay={2} />
        <StatCard label="Ponto de Equilíb." value={formatBRL(breakEvenValue)}  sub={`Faturamento: ${formatBRL(revenue)}`}           color={revenue >= breakEvenValue ? 'accent2' : 'danger'} delay={3} />
        <StatCard label="Taxa de Cartão"    value={formatPct(cardFeePercent)}   sub={`${formatBRL(cardFee)}/mês`}                   color="warn" delay={4} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CostBreakdown costs={breakdownCosts} />

        {/* Composição do faturamento */}
        <div className="bg-surface rounded-xl border border-border p-5 animate-fade-up delay-6">
          <h2 className="font-serif text-base text-dark mb-1">Composição do Faturamento</h2>
          <p className="text-xs text-muted mb-3">{formatBRL(revenue)} / mês</p>
          {revenue > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 11, color: '#7A624E' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-sm text-muted">Informe o faturamento em Custos Fixos</p>
            </div>
          )}
        </div>
      </div>

      {/* Health indicators */}
      <HealthIndicators cmv={cmv} folhaPct={folhaPct} margem={margem} faturamento={revenue} breakEven={breakEvenValue} />

      <AlertBox alerts={alerts} />
    </div>
  );
}
