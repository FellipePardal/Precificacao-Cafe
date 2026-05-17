import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { useIngredients } from '../hooks/useIngredients';
import { formatBRL } from '../utils/formatters';

const CATEGORIES = ['Carnes e Aves', 'Cereais e Grãos', 'Laticínios', 'Hortifrúti', 'Temperos', 'Panificação', 'Bebidas', 'Outros'];
const PURCHASE_UNITS = ['kg', 'g', 'L', 'ml', 'un'];

function empty() {
  return { name: '', category: '', purchaseUnit: 'kg', purchasePrice: '' };
}

function costPer100(price, unit) {
  if (!price) return '—';
  const p = parseFloat(price);
  if (unit === 'kg') return formatBRL((p / 1000) * 100);  // 100g
  if (unit === 'g')  return formatBRL(p * 100);            // 100g
  if (unit === 'L')  return formatBRL((p / 1000) * 100);  // 100ml
  if (unit === 'ml') return formatBRL(p * 100);            // 100ml
  return '—';
}

function costPerUnitLabel(unit) {
  if (unit === 'kg' || unit === 'g')  return '/100g';
  if (unit === 'L'  || unit === 'ml') return '/100ml';
  return '/un';
}

export default function Ingredientes() {
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useIngredients();
  const [form, setForm] = useState(empty());
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  function handleField(f, v) { setForm((p) => ({ ...p, [f]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.purchasePrice) return;
    if (editId) {
      updateIngredient(editId, { ...form, purchasePrice: parseFloat(form.purchasePrice) });
      setEditId(null);
    } else {
      addIngredient({ ...form, purchasePrice: parseFloat(form.purchasePrice) });
    }
    setForm(empty());
  }

  function startEdit(ing) {
    setForm({ name: ing.name, category: ing.category, purchaseUnit: ing.purchaseUnit, purchasePrice: ing.purchasePrice });
    setEditId(ing.id);
  }

  function cancelEdit() { setForm(empty()); setEditId(null); }

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const labelCls  = 'text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block';
  const inputCls  = 'border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30';
  const selectCls = inputCls + ' bg-white';

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <PageHeader title="Ingredientes" subtitle="Registre o que você compra no mercado para calcular os custos automaticamente" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-5 animate-fade-up">
        <h2 className="font-serif text-base text-dark mb-4">{editId ? 'Editar Ingrediente' : 'Novo Ingrediente'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Nome</label>
            <input required type="text" value={form.name} onChange={(e) => handleField('name', e.target.value)}
              placeholder="Ex: Filé de Frango" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Categoria</label>
            <select value={form.category} onChange={(e) => handleField('category', e.target.value)} className={selectCls}>
              <option value="">Selecione...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Unidade de Compra</label>
            <select value={form.purchaseUnit} onChange={(e) => handleField('purchaseUnit', e.target.value)} className={selectCls}>
              {PURCHASE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Preço pago (R$ / {form.purchaseUnit})</label>
            <div className="flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 bg-white">
              <span className="px-3 py-2.5 text-sm text-muted bg-surface2 border-r border-border font-medium">R$</span>
              <input required type="number" min="0" step="0.01" value={form.purchasePrice}
                onChange={(e) => handleField('purchasePrice', e.target.value)}
                placeholder="0,00"
                className="flex-1 px-3 py-2.5 text-sm text-dark bg-transparent focus:outline-none tabular-nums" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit"
              className="flex-1 bg-accent text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
              {editId ? 'Salvar' : '+ Adicionar'}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit}
                className="px-4 py-2.5 text-sm font-medium text-muted border border-border rounded-lg hover:bg-surface transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Search + Table */}
      <div className="bg-white rounded-xl border border-border animate-fade-up delay-1">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-dark">{ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''} cadastrado{ingredients.length !== 1 ? 's' : ''}</p>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="border border-border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 w-48" />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif text-lg text-muted">Nenhum ingrediente encontrado</p>
            <p className="text-sm text-muted/70 mt-1">Adicione ingredientes usando o formulário acima.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest">Nome</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest">Categoria</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest">Preço de Compra</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest">Custo unitário</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing) => (
                <tr key={ing.id} className={`border-b border-border/60 hover:bg-surface/60 transition-colors ${editId === ing.id ? 'bg-accent-light' : ''}`}>
                  <td className="px-4 py-3 text-sm font-semibold text-dark">{ing.name}</td>
                  <td className="px-4 py-3">
                    {ing.category ? (
                      <span className="text-xs font-medium text-muted bg-surface2 px-2.5 py-1 rounded-full">{ing.category}</span>
                    ) : <span className="text-xs text-light">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-dark tabular-nums">
                    {formatBRL(ing.purchasePrice)}<span className="text-muted">/{ing.purchaseUnit}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-accent2 font-semibold tabular-nums">
                    {['un'].includes(ing.purchaseUnit)
                      ? `${formatBRL(ing.purchasePrice)}/un`
                      : `${costPer100(ing.purchasePrice, ing.purchaseUnit)}${costPerUnitLabel(ing.purchaseUnit)}`
                    }
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
