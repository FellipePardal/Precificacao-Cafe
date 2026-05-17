import React, { useState } from 'react';
import { sellingPrice } from '../../utils/pricing';
import { formatBRL, formatPct } from '../../utils/formatters';

const statusCfg = {
  ok:     { cls: 'bg-accent2 text-white',             label: 'Boa margem!' },
  warn:   { cls: 'bg-warn-light text-warn border border-warn/30', label: 'Margem aceitável' },
  danger: { cls: 'bg-danger-light text-danger border border-danger/30', label: 'Margem baixa' },
};

export default function ModoValidacao() {
  const [custo, setCusto] = useState('');
  const [preco, setPreco] = useState('');
  const [result, setResult] = useState(null);

  function analisar() {
    const c = parseFloat(custo) || 0;
    const p = parseFloat(preco) || 0;
    if (!p) return;
    const margemAtual = ((p - c) / p) * 100;
    setResult({ margemAtual, precoIdeal: sellingPrice(c, 40), status: margemAtual >= 40 ? 'ok' : margemAtual >= 25 ? 'warn' : 'danger', p });
  }

  const wrapCls = "flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 bg-white";
  const prefCls = "px-3 py-2.5 text-sm text-muted bg-surface2 border-r border-border font-medium select-none";
  const inpCls  = "flex-1 px-3 py-2.5 text-sm text-dark bg-transparent focus:outline-none tabular-nums";
  const lblCls  = "text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lblCls}>Custo Total</label>
          <div className={wrapCls}><span className={prefCls}>R$</span><input type="number" min="0" step="0.01" value={custo} onChange={(e) => setCusto(e.target.value)} placeholder="0,00" className={inpCls} /></div>
        </div>
        <div>
          <label className={lblCls}>Preço Praticado</label>
          <div className={wrapCls}><span className={prefCls}>R$</span><input type="number" min="0" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="0,00" className={inpCls} /></div>
        </div>
      </div>

      <button onClick={analisar} className="w-full bg-accent text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
        Analisar Preço
      </button>

      {result && (
        <div className="space-y-3 animate-fade-up">
          <div className={`flex items-center justify-between px-4 py-3.5 rounded-xl ${statusCfg[result.status].cls}`}>
            <p className="text-sm font-semibold">{statusCfg[result.status].label}</p>
            <span className="font-serif text-xl">{formatPct(result.margemAtual)}</span>
          </div>
          <div className="bg-surface2 rounded-xl p-4">
            <p className="text-xs text-muted mb-1">Preço sugerido para 40% de margem</p>
            <p className="font-serif text-2xl text-accent">{formatBRL(result.precoIdeal)}</p>
            {result.margemAtual < 40 && (
              <p className="text-xs text-muted mt-2">Ajuste: <span className="font-semibold text-dark">{formatBRL(result.precoIdeal - result.p)}</span></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
