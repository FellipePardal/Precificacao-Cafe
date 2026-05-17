import React from 'react';
import IngredientRow from './IngredientRow';

const categories = [
  'Bebidas Quentes',
  'Bebidas Frias',
  'Salgados',
  'Doces & Sobremesas',
  'Lanches',
  'Pratos',
];

function newIngredient() {
  return { id: Date.now() + Math.random(), name: '', qty: '', unit: 'g', price: '' };
}

export default function ProductForm({ value, onChange }) {
  function handleField(field, val) {
    onChange({ ...value, [field]: val });
  }

  function addIngredient() {
    handleField('ingredients', [...(value.ingredients || []), newIngredient()]);
  }

  function updateIngredient(id, updated) {
    handleField(
      'ingredients',
      value.ingredients.map((ing) => (ing.id === id ? updated : ing))
    );
  }

  function removeIngredient(id) {
    handleField(
      'ingredients',
      value.ingredients.filter((ing) => ing.id !== id)
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-4">
      <h2 className="font-serif text-base text-dark">Dados do Produto</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">Nome do Produto</label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => handleField('name', e.target.value)}
            placeholder="Ex: Cappuccino"
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">Categoria</label>
          <select
            value={value.category}
            onChange={(e) => handleField('category', e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/30 bg-surface"
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">Porções</label>
          <input
            type="number"
            min="1"
            value={value.portions}
            onChange={(e) => handleField('portions', e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">Tempo Preparo (min)</label>
          <input
            type="number"
            min="0"
            value={value.prepTime}
            onChange={(e) => handleField('prepTime', e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">Embalagem (R$)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={value.packaging}
            onChange={(e) => handleField('packaging', e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted mb-1 block">Margem Desejada (%)</label>
        <input
          type="number"
          min="0"
          max="99"
          step="1"
          value={value.margin}
          onChange={(e) => handleField('margin', e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted">Ingredientes</label>
          <button
            onClick={addIngredient}
            className="text-xs font-medium text-accent hover:underline"
          >
            + Adicionar ingrediente
          </button>
        </div>
        {value.ingredients && value.ingredients.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_80px_64px_96px_36px] gap-2 mb-1">
              <span className="text-xs text-muted">Nome</span>
              <span className="text-xs text-muted">Qtd</span>
              <span className="text-xs text-muted">Unid</span>
              <span className="text-xs text-muted">Preço/un</span>
              <span />
            </div>
            {value.ingredients.map((ing) => (
              <IngredientRow
                key={ing.id}
                ingredient={ing}
                onChange={(updated) => updateIngredient(ing.id, updated)}
                onRemove={() => removeIngredient(ing.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted italic text-center py-4 bg-surface2 rounded-lg">
            Nenhum ingrediente adicionado
          </p>
        )}
      </div>
    </div>
  );
}
