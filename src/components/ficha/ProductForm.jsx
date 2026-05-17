import React from 'react';
import IngredientRow from './IngredientRow';

const categories = ['Bebidas Quentes', 'Bebidas Frias', 'Salgados', 'Doces & Sobremesas', 'Lanches', 'Pratos'];

function newIngredient() {
  return { id: crypto.randomUUID(), ingredientId: '', name: '', qty: '', unit: 'g', price: '' };
}

const labelCls  = 'text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block';
const inputCls  = 'border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30';
const selectCls = inputCls;

export default function ProductForm({ value, onChange }) {
  function set(field, val) { onChange({ ...value, [field]: val }); }

  function addIngredient()         { set('ingredients', [...(value.ingredients || []), newIngredient()]); }
  function update(id, updated)     { set('ingredients', value.ingredients.map((i) => (i.id === id ? updated : i))); }
  function remove(id)              { set('ingredients', value.ingredients.filter((i) => i.id !== id)); }

  return (
    <div className="bg-white rounded-xl border border-border p-5 space-y-5 animate-fade-up">
      <h2 className="font-serif text-base text-dark">Dados do Produto</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nome do Produto</label>
          <input type="text" value={value.name} onChange={(e) => set('name', e.target.value)}
            placeholder="Ex: Prato Filé de Frango" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Categoria</label>
          <select value={value.category} onChange={(e) => set('category', e.target.value)} className={selectCls}>
            <option value="">Selecione...</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Porções</label>
          <input type="number" min="1" value={value.portions} onChange={(e) => set('portions', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Preparo (min)</label>
          <input type="number" min="0" value={value.prepTime} onChange={(e) => set('prepTime', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Embalagem (R$)</label>
          <input type="number" min="0" step="0.01" value={value.packaging} onChange={(e) => set('packaging', e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Margem Desejada (%)</label>
        <input type="number" min="0" max="99" value={value.margin} onChange={(e) => set('margin', e.target.value)} className={inputCls} />
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelCls + ' mb-0'}>Ingredientes</label>
          <button type="button" onClick={addIngredient}
            className="text-xs font-semibold text-accent hover:underline">
            + Adicionar ingrediente
          </button>
        </div>

        {value.ingredients && value.ingredients.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_72px_68px_72px_auto] gap-2 mb-1 px-0.5">
              <span className="text-[11px] text-muted font-semibold uppercase tracking-widest">Ingrediente</span>
              <span className="text-[11px] text-muted font-semibold uppercase tracking-widest">Qtd</span>
              <span className="text-[11px] text-muted font-semibold uppercase tracking-widest">Unid</span>
              <span className="text-[11px] text-muted font-semibold uppercase tracking-widest">Custo</span>
              <span />
            </div>
            {value.ingredients.map((ing) => (
              <IngredientRow
                key={ing.id}
                ingredient={ing}
                onChange={(updated) => update(ing.id, updated)}
                onRemove={() => remove(ing.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-surface rounded-xl border border-dashed border-border">
            <p className="text-sm text-muted">Nenhum ingrediente adicionado ainda.</p>
            <p className="text-xs text-muted/70 mt-1">
              Cadastre os ingredientes em <strong>Ingredientes</strong> e selecione aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
