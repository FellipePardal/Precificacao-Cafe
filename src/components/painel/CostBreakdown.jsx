import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatBRL } from '../../utils/formatters';

const labels = {
  aluguel:  'Aluguel',
  folha:    'Folha',
  energia:  'Energia',
  aguaGas:  'Água & Gás',
  internet: 'Internet',
  outros:   'Outros',
};

const COLORS = ['#6B3E1E', '#286044', '#9B6F10', '#3D7FCE', '#B03030', '#7A624E'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl px-3 py-2 shadow text-xs">
      <p className="font-medium text-dark">{payload[0].payload.label}</p>
      <p className="text-muted mt-0.5">{formatBRL(payload[0].value)}</p>
    </div>
  );
}

export default function CostBreakdown({ costs }) {
  const total = Object.values(costs).reduce((s, v) => s + v, 0);

  const data = Object.entries(costs)
    .map(([key, value]) => ({ key, label: labels[key] || key, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-up delay-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-base text-dark">Custos Fixos</h2>
        <span className="font-serif text-lg text-dark">{formatBRL(total)}</span>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} layout="vertical" barSize={10} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={62}
            tick={{ fontSize: 11, fill: '#7A624E' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F2EAE0' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={entry.key} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Progress rows */}
      <div className="space-y-2 mt-3 pt-3 border-t border-border">
        {data.map(({ key, label, value }, i) => {
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted">{label}</span>
                <span className="text-xs font-medium text-dark tabular-nums">{formatBRL(value)}</span>
              </div>
              <div className="h-1 bg-surface2 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
