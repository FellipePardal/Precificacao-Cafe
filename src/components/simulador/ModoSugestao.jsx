import React, { useState } from 'react';
import { sellingPrice, markup } from '../../utils/pricing';
import { formatBRL, formatPct, formatMarkup } from '../../utils/formatters';

export default function ModoSugestao() {
  const [custo, setCusto] = useState('');
  const [margem, setMargem] = useState('40');
  const [result, setResult] = useState(null);

  function calcular() {
    const c = parseFloat(custo) || 0;
    const m = parseFloat(margem) || 0;
    const preco = sellingPrice(c, m);
    setResult({ preco, mk: markup(m), lucro: preco - c, m });
  }

  const wrapCls = "flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 bg-white";
  const prefCls = "px-3 py-2.5 text-sm text-muted bg-surface2 border-r border-border font-medium select-none";
  const sufCls  = "px-3 py-2.5 text-sm text-muted bg-surface2 border-l border-border font-medium select-none";
  const inpCls  = "flex-1 px-3 py-2.5 text-sm text-dark bg-transparent focus:outline-none tabular-nums";
  const lblCls  = "text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lblCls}>Custo Total</label>
          <div className={wrapCls}>
            <span className={prefCls}>R$</span>
            <input type="number" min="0" step="0.01" value={custo} onChange={(e) => setCusto(e.target.value)} placeholder="0,00" className={inpCls} />
          </div>
        </div>
        <div>
          <label className={lblCls}>Margem Desejada</label>
          <div className={wrapCls}>
            <input type="number" min="0" max="99" value={margem} onChange={(e) => setMargem(e.target.value)} className={inpCls} />
            <span className={sufCls}>%</span>
          </div>
        </div>
      </div>

      <button onClick={calcular} className="w-full bg-accent text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
        Calcular Preço Ideal
      </button>

      {result && (
        <div className="space-y-3 animate-fade-up">
          <div className="bg-accent rounded-xl p-5 text-center">
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-1.5">Preço Sugerido</p>
            <p className="font-serif text-4xl text-white leading-none">{formatBRL(result.preco)}</p>
            <p className="text-xs text-white/50 mt-1.5">com {formatPct(result.m)} de margem</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface2 rounded-xl p-4 text-center">
              <p className="text-[11px] text-muted uppercase tracking-widest mb-1">Markup</p>
              <p className="font-serif text-xl text-dark">{formatMarkup(result.mk)}</p>
            </div>
            <div className="bg-accent2 rounded-xl p-4 text-center">
              <p className="text-[11px] text-white/60 uppercase tracking-widest mb-1">Lucro/Venda</p>
              <p className="font-serif text-xl text-white">{formatBRL(result.lucro)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
