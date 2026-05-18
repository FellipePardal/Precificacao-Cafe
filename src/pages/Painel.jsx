import React from 'react';
import { useCosts } from '../hooks/useCosts';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/painel/StatCard';
import CostBreakdown from '../components/painel/CostBreakdown';
import HealthIndicators from '../components/painel/HealthIndicators';
import AlertBox from '../components/painel/AlertBox';
import { formatBRL, formatPct } from '../utils/formatters';

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

export default function Painel() {
  const { fixedCosts, payroll, cardFeePercent, revenue, totalFixed, totalMonthlyCost, cmv, breakEvenValue } = useCosts();

  const folhaPct = revenue > 0 ? (payroll / revenue) * 100 : 0;
  const lucro    = revenue - totalMonthlyCost - (revenue * cardFeePercent / 100);
  const margem   = revenue > 0 ? (lucro / revenue) * 100 : 0;
  const alerts   = buildAlerts({ cmv, folhaPct, margem, faturamento: revenue, breakEvenValue });

  const breakdownCosts = { ...fixedCosts, folha: payroll };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <PageHeader title="Painel Geral" subtitle="Visão financeira do seu negócio" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Lucro Estimado"    value={formatBRL(lucro)}          sub={`${formatPct(margem)} de margem`}              color={margem >= 40 ? 'accent2' : margem >= 25 ? 'warn' : 'danger'} delay={1} />
        <StatCard label="Custo Total"       value={formatBRL(totalMonthlyCost)} sub={`Fixos: ${formatBRL(totalFixed)}`}            color="accent"  delay={2} />
        <StatCard label="Ponto de Equilíb." value={formatBRL(breakEvenValue)} sub={`Faturamento: ${formatBRL(revenue)}`}           color={revenue >= breakEvenValue ? 'accent2' : 'danger'} delay={3} />
        <StatCard label="Taxa de Cartão"    value={formatPct(cardFeePercent)}  sub={`${formatBRL(revenue * cardFeePercent / 100)}/mês`} color="warn" delay={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CostBreakdown costs={breakdownCosts} />
        <HealthIndicators cmv={cmv} folhaPct={folhaPct} margem={margem} faturamento={revenue} breakEven={breakEvenValue} />
      </div>

      <AlertBox alerts={alerts} />

    </div>
  );
}
