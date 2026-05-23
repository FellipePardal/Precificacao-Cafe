import React, { useState, useRef, useEffect } from 'react';
import {
  useCostsStore, prevYM, nextYM, ymLabel, ymNow,
  totalVariableCosts, categoryTotal, VARIABLE_KEYS,
} from '../store/costsStore';
import { formatBRL } from '../utils/formatters';
import PageHeader from '../components/layout/PageHeader';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const CATS = {
  mercado:    { label: 'Supermercado',   color: '#6B3E1E', light: '#F5EAE0' },
  feira:      { label: 'Feira',          color: '#286044', light: '#E2F0EB' },
  hortifruti: { label: 'Hortifrúti',     color: '#3D8B37', light: '#E4F5E1' },
  salgados:   { label: 'Forn. Salgados', color: '#9B6F10', light: '#FBF4DC' },
  doces:      { label: 'Forn. Doces',    color: '#B03030', light: '#FCEAEA' },
  outros:     { label: 'Outros',         color: '#7A624E', light: '#F2EAE0' },
};

function buildChartData(monthlyData, selectedMonth) {
  const months = [];
  let ym = selectedMonth;
  for (let i = 5; i >= 0; i--) { months.unshift(ym); ym = prevYM(ym); }
  return months.map((m) => {
    const vc = monthlyData[m]?.variableCosts || {};
    return {
      month: ymLabel(m),
      ...Object.fromEntries(VARIABLE_KEYS.map((k) => [k, categoryTotal(vc, k)])),
    };
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="bg-white border border-border rounded-xl p-3 shadow-lg text-xs min-w-[160px]">
      <p className="font-semibold text-dark mb-2">{label}</p>
      {payload.map((p) => p.value > 0 && (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
          <span className="text-muted">{CATS[p.dataKey]?.label}</span>
          <span className="font-medium text-dark tabular-nums">{formatBRL(p.value)}</span>
        </div>
      ))}
      <div className="flex justify-between gap-4 pt-1.5 mt-1.5 border-t border-border">
        <span className="font-semibold text-dark">Total</span>
        <span className="font-semibold text-dark tabular-nums">{formatBRL(total)}</span>
      </div>
    </div>
  );
}

function CategoryIcon({ catKey, color, size = 16 }) {
  const p = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: '1.8', viewBox: '0 0 24 24' };
  switch (catKey) {
    case 'mercado':
      return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>;
    case 'feira':
      return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
    case 'hortifruti':
      return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16s1-1 3-1 3.5 2 5 2 3-1 3-1V4s-1 1-3 1-3.5-2-5-2-3 1-3 1z"/><line strokeLinecap="round" strokeLinejoin="round" x1="4" y1="20" x2="4" y2="16"/></svg>;
    case 'salgados':
      return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M3 11l19-9-9 19-2-8-8-2z"/></svg>;
    case 'doces':
      return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/></svg>;
    default:
      return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>;
  }
}

// Linha de item editável
function ItemRow({ item, catKey, onUpdate, onRemove }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingValue, setEditingValue] = useState(false);
  const [draftLabel, setDraftLabel]     = useState(item.label);
  const [draftValue, setDraftValue]     = useState(String(item.value));
  const labelRef = useRef(null);
  const valueRef = useRef(null);

  useEffect(() => { if (editingLabel) labelRef.current?.select(); }, [editingLabel]);
  useEffect(() => { if (editingValue) valueRef.current?.select(); }, [editingValue]);

  function commitLabel() {
    onUpdate(item.id, 'label', draftLabel || 'Compra');
    setEditingLabel(false);
  }
  function commitValue() {
    onUpdate(item.id, 'value', draftValue);
    setEditingValue(false);
  }

  const cat = CATS[catKey];

  return (
    <div className="flex items-center gap-3 group/item py-2 px-3 rounded-lg hover:bg-surface transition-colors">
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />

      {/* Label */}
      <div className="flex-1 min-w-0">
        {editingLabel ? (
          <input
            ref={labelRef}
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => { if (e.key === 'Enter') commitLabel(); if (e.key === 'Escape') { setDraftLabel(item.label); setEditingLabel(false); } }}
            className="w-full text-sm border border-border rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
          />
        ) : (
          <span
            className="text-sm text-dark cursor-pointer hover:text-accent transition-colors truncate block"
            onClick={() => { setDraftLabel(item.label); setEditingLabel(true); }}
            title="Clique para editar o nome"
          >
            {item.label}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="shrink-0">
        {editingValue ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted">R$</span>
            <input
              ref={valueRef}
              type="number" min="0" step="0.01"
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              onBlur={commitValue}
              onKeyDown={(e) => { if (e.key === 'Enter') commitValue(); if (e.key === 'Escape') { setDraftValue(String(item.value)); setEditingValue(false); } }}
              className="w-24 text-sm text-right border border-border rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-accent/30 tabular-nums bg-white"
            />
          </div>
        ) : (
          <span
            className="text-sm font-semibold text-dark cursor-pointer hover:text-accent transition-colors tabular-nums"
            onClick={() => { setDraftValue(String(item.value)); setEditingValue(true); }}
            title="Clique para editar o valor"
          >
            {formatBRL(item.value)}
          </span>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 text-muted hover:text-red-500 shrink-0"
        title="Remover"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

// Painel de detalhes de uma categoria
function DetailPanel({ catKey, variableCosts, onAdd, onUpdate, onRemove }) {
  const cat   = CATS[catKey];
  const items = Array.isArray(variableCosts[catKey]) ? variableCosts[catKey] : [];
  const total = categoryTotal(variableCosts, catKey);

  return (
    <div
      className="bg-white rounded-xl border-2 overflow-hidden animate-fade-up"
      style={{ borderColor: cat.color }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: cat.light }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color + '22' }}>
          <CategoryIcon catKey={catKey} color={cat.color} size={14} />
        </div>
        <h3 className="font-semibold text-sm" style={{ color: cat.color }}>{cat.label}</h3>
        <span className="ml-auto text-xs font-medium" style={{ color: cat.color }}>
          {items.length} {items.length === 1 ? 'compra' : 'compras'}
        </span>
      </div>

      {/* Items list */}
      <div className="px-2 py-2">
        {items.length === 0 ? (
          <p className="text-xs text-muted text-center py-4">Nenhuma compra registrada</p>
        ) : (
          <div className="divide-y divide-border/50">
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                catKey={catKey}
                onUpdate={(id, field, value) => onUpdate(catKey, id, field, value)}
                onRemove={(id) => onRemove(catKey, id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-border/50">
        <button
          onClick={() => onAdd(catKey)}
          className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: cat.color }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Adicionar compra
        </button>
        <div className="text-right">
          <p className="text-[10px] text-muted uppercase tracking-widest">Total</p>
          <p className="font-serif text-lg text-dark tabular-nums">{formatBRL(total)}</p>
        </div>
      </div>
    </div>
  );
}

// Card resumo de uma categoria
function SummaryCard({ catKey, variableCosts, prevVariableCosts, total, isActive, onClick, delay }) {
  const cat       = CATS[catKey];
  const value     = categoryTotal(variableCosts, catKey);
  const prevValue = categoryTotal(prevVariableCosts, catKey);
  const pct       = total > 0 ? (value / total) * 100 : 0;
  const change    = prevValue > 0 ? ((value - prevValue) / prevValue) * 100 : 0;
  const items     = Array.isArray(variableCosts[catKey]) ? variableCosts[catKey] : [];
  const isUp      = change > 1;
  const isDown    = change < -1;

  return (
    <div
      className={`bg-white rounded-xl border-2 p-4 animate-fade-up delay-${delay} cursor-pointer transition-all duration-150`}
      style={{ borderColor: isActive ? cat.color : 'transparent', outline: isActive ? 'none' : undefined,
        boxShadow: isActive ? `0 0 0 1px ${cat.color}` : undefined }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.light }}>
            <CategoryIcon catKey={catKey} color={cat.color} size={15} />
          </div>
          <div>
            <span className="text-sm font-semibold text-dark leading-tight block">{cat.label}</span>
            <span className="text-[10px] text-muted">{items.length} {items.length === 1 ? 'compra' : 'compras'}</span>
          </div>
        </div>
        {(isUp || isDown) && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${isUp ? 'bg-danger-light text-danger' : 'bg-accent2-light text-accent2'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(0)}%
          </span>
        )}
      </div>

      <p className="font-serif text-[1.5rem] text-dark leading-none mb-3 tabular-nums">{formatBRL(value)}</p>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-[10px] text-muted">{pct.toFixed(1)}% do total</span>
          {prevValue > 0 && <span className="text-[10px] text-light tabular-nums">Ant: {formatBRL(prevValue)}</span>}
        </div>
        <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
        </div>
      </div>
    </div>
  );
}

export default function CustosVariaveis() {
  const store = useCostsStore();
  const {
    selectedMonth, monthlyData, setSelectedMonth,
    addVariableItem, updateVariableItem, removeVariableItem,
  } = store;

  const currentYM = ymNow();
  const atCurrent = selectedMonth === currentYM;

  const variableCosts     = monthlyData[selectedMonth]?.variableCosts || {};
  const prevVariableCosts = monthlyData[prevYM(selectedMonth)]?.variableCosts || {};

  const total      = totalVariableCosts(variableCosts);
  const prevTotal  = totalVariableCosts(prevVariableCosts);
  const totalChange = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

  const [slideClass, setSlideClass]       = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const detailRef = useRef(null);

  function navigate(ym, direction) {
    setSlideClass(direction === 'prev' ? 'animate-slide-left' : 'animate-slide-right');
    setSelectedMonth(ym);
    setActiveCategory(null);
  }

  function handleCardClick(key) {
    setActiveCategory(prev => prev === key ? null : key);
    // scroll suave ao painel de detalhes
    if (activeCategory !== key) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  }

  function handleAdd(key) {
    addVariableItem(key);
  }

  const chartData = buildChartData(monthlyData, selectedMonth);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Custos Variáveis"
        subtitle="Compras por categoria — clique em um card para ver e editar os detalhes"
      />

      {/* Month navigation + total */}
      <div className="bg-white rounded-xl border border-border px-5 py-4 flex items-center justify-between animate-fade-up">
        <button
          onClick={() => navigate(prevYM(selectedMonth), 'prev')}
          className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-dark"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="font-serif text-lg text-dark leading-none">{ymLabel(selectedMonth)}</p>
            {atCurrent
              ? <p className="text-[10px] text-accent2 font-semibold uppercase tracking-widest mt-1">Mês atual</p>
              : <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Histórico</p>}
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="font-serif text-2xl text-dark leading-none tabular-nums">{formatBRL(total)}</p>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mt-1 ${totalChange > 2 ? 'text-danger' : totalChange < -2 ? 'text-accent2' : 'text-muted'}`}>
              {totalChange > 0.5 ? '▲' : totalChange < -0.5 ? '▼' : '—'}{' '}
              {Math.abs(totalChange).toFixed(1)}% vs mês anterior
            </p>
          </div>
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

      {/* Summary cards */}
      <div key={selectedMonth} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${slideClass}`}>
        {Object.keys(CATS).map((key, i) => (
          <SummaryCard
            key={key}
            catKey={key}
            variableCosts={variableCosts}
            prevVariableCosts={prevVariableCosts}
            total={total}
            isActive={activeCategory === key}
            onClick={() => handleCardClick(key)}
            delay={i + 1}
          />
        ))}
      </div>

      {/* Detail panel */}
      {activeCategory && (
        <div ref={detailRef}>
          <DetailPanel
            catKey={activeCategory}
            variableCosts={variableCosts}
            onAdd={handleAdd}
            onUpdate={updateVariableItem}
            onRemove={removeVariableItem}
          />
        </div>
      )}

      {/* Trend chart */}
      <div className="bg-white rounded-xl border border-border p-5 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base text-dark">Tendência — Últimos 6 meses</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATS).map(([key, cat]) => (
              <span key={key} className="flex items-center gap-1 text-[10px] text-muted">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                {cat.label}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={32} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2EAE0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7A624E' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              tick={{ fontSize: 11, fill: '#7A624E' }} axisLine={false} tickLine={false} width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F2EAE0', radius: 4 }} />
            {Object.entries(CATS).map(([key, cat], i) => (
              <Bar
                key={key} dataKey={key} stackId="a" fill={cat.color}
                radius={i === Object.keys(CATS).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown por categoria */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-fade-up">
        {Object.entries(CATS).map(([key, cat]) => {
          const value = categoryTotal(variableCosts, key);
          const pct   = total > 0 ? (value / total) * 100 : 0;
          return (
            <div
              key={key}
              className="bg-white rounded-xl border border-border p-3 text-center cursor-pointer hover:border-accent/30 transition-colors"
              onClick={() => handleCardClick(key)}
            >
              <div className="w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: cat.light }}>
                <CategoryIcon catKey={key} color={cat.color} size={12} />
              </div>
              <p className="text-[10px] text-muted font-medium truncate">{cat.label}</p>
              <p className="font-serif text-sm text-dark mt-0.5">{pct.toFixed(0)}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
