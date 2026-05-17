import { useCostsStore, totalFixedCosts } from '../store/costsStore';
import {
  costPerMinute,
  laborCost,
  totalItemCost,
  sellingPrice,
  markup,
  calcIngredientCost,
} from '../utils/pricing';

export function usePricing({ ingredients = [], prepTime = 0, packaging = 0, margin = 40 }) {
  const store = useCostsStore();
  const totalFixed = totalFixedCosts(store);
  const totalMonthlyCost = totalFixed + store.rawMaterial;
  const costPerMin = costPerMinute(totalMonthlyCost, store.workDays, store.hoursPerDay);

  const ingredientCost = calcIngredientCost(ingredients);
  const laborCostValue = laborCost(costPerMin, parseFloat(prepTime) || 0);
  const packagingCost = parseFloat(packaging) || 0;
  const totalCost = totalItemCost(ingredientCost, packagingCost, laborCostValue);
  const suggestedPrice = sellingPrice(totalCost, parseFloat(margin) || 0);
  const markupValue = markup(parseFloat(margin) || 0);
  const profitPerSale = suggestedPrice - totalCost;

  return {
    ingredientCost,
    laborCostValue,
    totalCost,
    suggestedPrice,
    markupValue,
    profitPerSale,
  };
}
