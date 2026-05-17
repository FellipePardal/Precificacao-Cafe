import React from 'react';
import { formatBRL, formatPct, formatMarkup } from '../../utils/formatters';

export default function PricingResult({ ingredientCost, laborCost, totalCost, suggestedPrice, markupValue, profitPerSale, margin, onSave }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 space-y-4 animate-fade-up delay-2">
      <h2 className="font-serif text-base text-dark">Resultado</h2>

      {/* Breakdown */}
      <div className="space-y-2">
        {[
          { label: 'Ingredientes', value: formatBRL(ingredientCost) },
          { label: 'Mão de Obra',  value: formatBRL(laborCost) },
        ].map((l) => (
          <div key={l.label} className="flex justify-between text-sm">
            <span className="text-muted">{l.label}</span>
            <span className="font-medium text-dark tabular-nums">{l.value}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-sm font-semibold text-dark">Custo Total</span>
          <span className="font-serif text-lg text-dark tabular-nums">{formatBRL(totalCost)}</span>
        </div>
      </div>

      {/* Preço hero — marrom */}
      <div className="bg-accent rounded-xl p-5 text-center">
        <p className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-1.5">Preço Sugerido</p>
        <p className="font-serif text-4xl text-white leading-none">{formatBRL(suggestedPrice)}</p>
        <p className="text-xs text-white/50 mt-1.5">com {formatPct(margin)} de margem</p>
      </div>

      {/* Métricas — verde */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface2 rounded-xl p-3.5 text-center">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Markup</p>
          <p className="font-serif text-xl text-dark">{formatMarkup(markupValue)}</p>
        </div>
        <div className="bg-accent2 rounded-xl p-3.5 text-center">
          <p className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-1">Lucro/Venda</p>
          <p className="font-serif text-xl text-white">{formatBRL(profitPerSale)}</p>
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-accent2 text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        Salvar no Cardápio
      </button>
    </div>
  );
}
