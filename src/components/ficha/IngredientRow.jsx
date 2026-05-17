import React from 'react';

const units = ['g', 'kg', 'ml', 'L', 'un'];

export default function IngredientRow({ ingredient, onChange, onRemove }) {
  function handle(field, value) {
    onChange({ ...ingredient, [field]: value });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Ingrediente"
        value={ingredient.name}
        onChange={(e) => handle('name', e.target.value)}
        className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 flex-1 min-w-0"
      />
      <input
        type="number"
        placeholder="Qtd"
        min="0"
        step="0.001"
        value={ingredient.qty}
        onChange={(e) => handle('qty', e.target.value)}
        className="border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 w-20"
      />
      <select
        value={ingredient.unit}
        onChange={(e) => handle('unit', e.target.value)}
        className="border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-surface"
      >
        {units.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Preço/un"
        min="0"
        step="0.01"
        value={ingredient.price}
        onChange={(e) => handle('price', e.target.value)}
        className="border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 w-24"
      />
      <button
        onClick={onRemove}
        className="text-danger hover:bg-danger-light rounded-lg p-1.5 transition-colors shrink-0"
        title="Remover"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
