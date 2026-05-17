import React from 'react';
import { formatPct, formatBRL } from '../../utils/formatters';

const badge = {
  ok:     'bg-accent2-light text-accent2',
  warn:   'bg-warn-light text-warn',
  danger: 'bg-danger-light text-danger',
};
const label = { ok: 'Bom', warn: 'Atenção', danger: 'Crítico' };

function Row({ title, value, status, hint }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-dark">{title}</p>
        {hint && <p className="text-xs text-muted mt-0.5">{hint}</p>}
      </div>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <span className="text-sm font-semibold text-dark tabular-nums">{value}</span>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge[status]}`}>{label[status]}</span>
      </div>
    </div>
  );
}

export default function HealthIndicators({ cmv, folhaPct, margem, faturamento, breakEven }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-up delay-6">
      <h2 className="font-serif text-base text-dark mb-2">Indicadores de Saúde</h2>
      <Row title="CMV"                          value={formatPct(cmv)}        status={cmv < 35 ? 'ok' : cmv < 45 ? 'warn' : 'danger'}                hint="Ideal < 35%" />
      <Row title="Folha sobre Faturamento"      value={formatPct(folhaPct)}   status={folhaPct <= 30 ? 'ok' : folhaPct <= 40 ? 'warn' : 'danger'}    hint="Ideal 25–30%" />
      <Row title="Margem de Lucro"              value={formatPct(margem)}     status={margem >= 40 ? 'ok' : margem >= 25 ? 'warn' : 'danger'}         hint="Meta 40%" />
      <Row title="Faturamento vs Equilíbrio"    value={formatBRL(faturamento)} status={faturamento >= breakEven ? 'ok' : faturamento >= breakEven * 0.85 ? 'warn' : 'danger'} hint={`Mín. ${formatBRL(breakEven)}`} />
    </div>
  );
}
