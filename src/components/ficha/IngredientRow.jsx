import React from 'react';
import { useIngredients } from '../../hooks/useIngredients';
import { compatibleUnits, calcIngredientLineCost } from '../../utils/pricing';
import { formatBRL } from '../../utils/formatters';

export default function IngredientRow({ ingredient, onChange, onRemove }) {
  const { ingredients: catalog } = useIngredients();

  function handle(field, value) {
    onChange({ ...ingredient, [field]: value });
  }

  function selectCatalog(id) {
    if (!id) {
      // switched to manual
      onChange({ ...ingredient, ingredientId: '', name: '', purchaseUnit: undefined, purchasePrice: undefined, unit: 'g', price: '' });
      return;
    }
    const found = catalog.find((c) => c.id === id);
    if (!found) return;
    const units = compatibleUnits(found.purchaseUnit);
    onChange({
      ...ingredient,
      ingredientId: found.id,
      name: found.name,
      purchaseUnit: found.purchaseUnit,
      purchasePrice: found.purchasePrice,
      unit: units[0],
      price: undefined,
    });
  }

  const isLinked    = !!ingredient.ingredientId;
  const useUnits    = isLinked ? compatibleUnits(ingredient.purchaseUnit) : ['g', 'kg', 'ml', 'L', 'un'];
  const cost        = calcIngredientLineCost(ingredient);

  const inputCls  = 'border border-border rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30';
  const selectCls = inputCls + ' bg-white';

  return (
    <div className="grid grid-cols-[1fr_72px_68px_72px_auto] gap-2 items-center">

      {/* Ingredient selector */}
      {isLinked ? (
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-medium text-dark truncate flex-1">{ingredient.name}</span>
          <button
            type="button"
            onClick={() => selectCatalog('')}
            title="Desvinular"
            className="text-light hover:text-muted shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      ) : (
        <select
          value={ingredient.ingredientId || ''}
          onChange={(e) => e.target.value ? selectCatalog(e.target.value) : handle('ingredientId', '')}
          className={selectCls + ' w-full'}
        >
          <option value="">Personalizado...</option>
          {catalog.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.purchaseUnit})</option>
          ))}
        </select>
      )}

      {/* Qty */}
      <input
        type="number"
        placeholder="Qtd"
        min="0"
        step="0.001"
        value={ingredient.qty}
        onChange={(e) => handle('qty', e.target.value)}
        className={inputCls + ' w-full tabular-nums'}
      />

      {/* Unit */}
      <select
        value={ingredient.unit}
        onChange={(e) => handle('unit', e.target.value)}
        className={selectCls + ' w-full'}
      >
        {useUnits.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>

      {/* Price (manual only) or cost display */}
      {!isLinked ? (
        <input
          type="number"
          placeholder="R$/un"
          min="0"
          step="0.01"
          value={ingredient.price || ''}
          onChange={(e) => handle('price', e.target.value)}
          className={inputCls + ' w-full tabular-nums'}
        />
      ) : (
        <span className="text-sm font-semibold text-accent2 tabular-nums text-right">
          {formatBRL(cost)}
        </span>
      )}

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="text-light hover:text-danger hover:bg-danger-light rounded-lg p-1.5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}
