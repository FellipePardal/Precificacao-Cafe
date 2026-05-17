import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { useIngredients } from '../hooks/useIngredients';
import { formatBRL } from '../utils/formatters';

const CATEGORIES    = ['Carnes e Aves', 'Cereais e Grãos', 'Laticínios', 'Hortifrúti', 'Temperos', 'Panificação', 'Bebidas', 'Outros'];
const PURCHASE_UNITS = ['kg', 'g', 'L', 'ml', 'un'];

function empty() {
  return { name: '', category: '', purchaseQty: '', purchaseUnit: 'kg', totalPaid: '' };
}

// unit price = totalPaid / purchaseQty
function calcUnitPrice(totalPaid, purchaseQty) {
  const t = parseFloat(totalPaid);
  const q = parseFloat(purchaseQty);
  if (!t || !q || q === 0) return null;
  return t / q;
}

function costPer100Label(unit) {
  if (unit === 'kg' || unit === 'g')  return '/100g';
  if (unit === 'L'  || unit === 'ml') return '/100ml';
  return null;
}

function costPer100(pricePerUnit, unit) {
  if (!pricePerUnit) return null;
  if (unit === 'kg') return (pricePerUnit / 1000) * 100;
  if (unit === 'g')  return pricePerUnit * 100;
  if (unit === 'L')  return (pricePerUnit / 1000) * 100;
  if (unit === 'ml') return pricePerUnit * 100;
  return null;
}

const labelCls  = 'text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block';
const inputCls  = 'border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30';
const selectCls = inputCls;
const prefixWrap = 'flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 bg-white';
const prefixSpan = 'px-3 py-2.5 text-sm text-muted bg-surface2 border-r border-border font-medium select-none';
const innerInput = 'flex-1 px-3 py-2.5 text-sm text-dark bg-transparent focus:outline-none tabular-nums';

export default function Ingredientes() {
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useIngredients();
  const [form, setForm]   = useState(empty());
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  function set(f, v) { setForm((p) => ({ ...p, [f]: v })); }

  const unitPrice = calcUnitPrice(form.totalPaid, form.purchaseQty);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !unitPrice) return;
    const payload = {
      name:          form.name.trim(),
      category:      form.category,
      purchaseUnit:  form.purchaseUnit,
      purchasePrice: unitPrice,           // stored as price per unit
      purchaseQty:   parseFloat(form.purchaseQty),
      totalPaid:     parseFloat(form.totalPaid),
    };
    if (editId) { updateIngredient(editId, payload); setEditId(null); }
    else        { addIngredient(payload); }
    setForm(empty());
  }

  function startEdit(ing) {
    setForm({
      name:        ing.name,
      category:    ing.category,
      purchaseUnit: ing.purchaseUnit,
      purchaseQty:  String(ing.purchaseQty  || '1'),
      totalPaid:    String(ing.totalPaid    || ing.purchasePrice || ''),
    });
    setEditId(ing.id);
  }

  function cancelEdit() { setForm(empty()); setEditId(null); }

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Ingredientes"
        subtitle="Informe quanto comprou e quanto pagou — o custo por unidade é calculado automaticamente"
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-5 animate-fade-up">
        <h2 className="font-serif text-base text-dark mb-4">{editId ? 'Editar Ingrediente' : 'Registrar Compra'}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Nome */}
          <div className="md:col-span-2">
            <label className={labelCls}>Nome do ingrediente</label>
            <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Arroz, Filé de Frango..." className={inputCls} />
          </div>

          {/* Categoria */}
          <div>
            <label className={labelCls}>Categoria</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={selectCls}>
              <option value="">Selecione...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Unidade */}
          <div>
            <label className={labelCls}>Unidade</label>
            <select value={form.purchaseUnit} onChange={(e) => set('purchaseUnit', e.target.value)} className={selectCls}>
              {PURCHASE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Quantidade comprada */}
          <div>
            <label className={labelCls}>Quantidade comprada</label>
            <div className={prefixWrap}>
              <input required type="number" min="0.001" step="any" value={form.purchaseQty}
                onChange={(e) => set('purchaseQty', e.target.value)}
                placeholder="Ex: 5"
                className={innerInput} />
              <span className="px-3 py-2.5 text-sm text-muted bg-surface2 border-l border-border font-medium select-none">
                {form.purchaseUnit}
              </span>
            </div>
          </div>

          {/* Total pago */}
          <div>
            <label className={labelCls}>Total pago no mercado</label>
            <div className={prefixWrap}>
              <span className={prefixSpan}>R$</span>
              <input required type="number" min="0.01" step="0.01" value={form.totalPaid}
                onChange={(e) => set('totalPaid', e.target.value)}
                placeholder="Ex: 30,00"
                className={innerInput} />
            </div>
          </div>

          {/* Custo calculado — preview */}
          <div>
            <label className={labelCls}>Custo calculado</label>
            <div className="rounded-lg border border-border bg-surface2 px-3 py-2.5 h-[42px] flex items-center">
              {unitPrice ? (
                <span className="text-sm font-semibold text-accent2 tabular-nums">
                  {formatBRL(unitPrice)}/{form.purchaseUnit}
                  {costPer100Label(form.purchaseUnit) && (
                    <span className="text-muted font-normal">
                      {' '}· {formatBRL(costPer100(unitPrice, form.purchaseUnit))}{costPer100Label(form.purchaseUnit)}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-sm text-muted">preencha os campos</span>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-end gap-2">
            <button type="submit"
              className="flex-1 bg-accent text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
              {editId ? 'Salvar' : '+ Adicionar'}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit}
                className="px-3 py-2.5 text-sm font-medium text-muted border border-border rounded-lg hover:bg-surface transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border animate-fade-up delay-1">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-dark">
            {ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''} cadastrado{ingredients.length !== 1 ? 's' : ''}
          </p>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="border border-border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 w-44" />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif text-lg text-muted">Nenhum ingrediente encontrado</p>
            <p className="text-sm text-muted/70 mt-1">Use o formulário acima para registrar suas compras.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface border-b border-border">
                {['Ingrediente', 'Categoria', 'Última Compra', 'Custo/unidade', 'Custo/100g·ml'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest">{h}</th>
                ))}
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing) => {
                const per100 = costPer100(ing.purchasePrice, ing.purchaseUnit);
                const per100label = costPer100Label(ing.purchaseUnit);
                return (
                  <tr key={ing.id} className={`border-b border-border/60 hover:bg-surface/60 transition-colors ${editId === ing.id ? 'bg-accent-light' : ''}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-dark">{ing.name}</td>
                    <td className="px-4 py-3">
                      {ing.category
                        ? <span className="text-xs font-medium text-muted bg-surface2 px-2.5 py-1 rounded-full">{ing.category}</span>
                        : <span className="text-xs text-light">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted tabular-nums">
                      {ing.purchaseQty ? `${ing.purchaseQty} ${ing.purchaseUnit} · ${formatBRL(ing.totalPaid || ing.purchasePrice * ing.purchaseQty)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-dark tabular-nums">
                      {formatBRL(ing.purchasePrice)}<span className="text-muted font-normal">/{ing.purchaseUnit}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-accent2 font-semibold tabular-nums">
                      {per100 && per100label ? `${formatBRL(per100)}${per100label}` : `${formatBRL(ing.purchasePrice)}/un`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => startEdit(ing)}
                          className="text-muted hover:text-accent p-1.5 rounded-lg hover:bg-accent-light transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button onClick={() => removeIngredient(ing.id)}
                          className="text-muted hover:text-danger p-1.5 rounded-lg hover:bg-danger-light transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
