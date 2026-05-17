import React from 'react';
import { formatBRL, formatPct } from '../../utils/formatters';
import { calcIngredientCost, totalItemCost, laborCost, sellingPrice, costPerMinute } from '../../utils/pricing';
import { useCosts } from '../../hooks/useCosts';

function MargemBadge({ pct }) {
  if (pct >= 40) return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent2-light text-accent2">Ótimo</span>;
  if (pct >= 25) return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-warn-light text-warn">Aceitável</span>;
  return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-danger-light text-danger">Baixo</span>;
}

export default function ProductRow({ product, onRemove, index = 0 }) {
  const { totalMonthlyCost, workDays, hoursPerDay } = useCosts();
  const costPerMin = costPerMinute(totalMonthlyCost, workDays, hoursPerDay);

  const ingredientCost = calcIngredientCost(product.ingredients || []);
  const labCost = laborCost(costPerMin, parseFloat(product.prepTime) || 0);
  const packaging = parseFloat(product.packaging) || 0;
  const total = totalItemCost(ingredientCost, packaging, labCost);
  const price = sellingPrice(total, parseFloat(product.margin) || 0);
  const margin = parseFloat(product.margin) || 0;

  return (
    <tr className={`border-b border-border/60 hover:bg-surface2/60 transition-colors animate-fade-up delay-${Math.min(index + 1, 6)}`}>
      <td className="px-4 py-3.5">
        <p className="text-sm font-semibold text-dark">{product.name}</p>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-xs font-medium text-muted bg-surface2 px-2.5 py-1 rounded-full">{product.category}</span>
      </td>
      <td className="px-4 py-3.5 text-sm text-muted tabular-nums">{formatBRL(total)}</td>
      <td className="px-4 py-3.5">
        <span className="text-sm font-semibold text-accent tabular-nums">{formatBRL(price)}</span>
      </td>
      <td className="px-4 py-3.5 text-sm text-dark tabular-nums">{formatPct(margin)}</td>
      <td className="px-4 py-3.5">
        <MargemBadge pct={margin} />
      </td>
      <td className="px-4 py-3.5">
        <button
          onClick={() => onRemove(product.id)}
          className="text-light hover:text-danger hover:bg-danger-light rounded-lg p-1.5 transition-all"
          title="Remover"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
