export function costPerMinute(totalMonthlyCost, workDays = 26, hoursPerDay = 10) {
  const totalMinutes = workDays * hoursPerDay * 60;
  if (totalMinutes === 0) return 0;
  return totalMonthlyCost / totalMinutes;
}

export function laborCost(costPerMin, prepTimeMinutes) {
  return costPerMin * prepTimeMinutes;
}

export function totalItemCost(ingredientCost, packagingCost, laborCostValue) {
  return ingredientCost + packagingCost + laborCostValue;
}

export function sellingPrice(totalCost, marginPercent) {
  const m = marginPercent / 100;
  if (m >= 1) return 0;
  return totalCost / (1 - m);
}

export function markup(marginPercent) {
  const m = marginPercent / 100;
  if (m >= 1) return 0;
  return 1 / (1 - m);
}

export function breakEven(fixedCosts, cmvPercent, cardFeePercent) {
  const denominator = 1 - cmvPercent / 100 - cardFeePercent / 100;
  if (denominator <= 0) return 0;
  return fixedCosts / denominator;
}

export function cmvPercent(rawMaterialCost, revenue) {
  if (revenue === 0) return 0;
  return (rawMaterialCost / revenue) * 100;
}

// Convert quantity to the purchase unit (e.g. 200g → 0.2kg)
export function convertToUnit(qty, fromUnit, toUnit) {
  if (fromUnit === toUnit) return qty;
  if (fromUnit === 'g'  && toUnit === 'kg') return qty / 1000;
  if (fromUnit === 'kg' && toUnit === 'g')  return qty * 1000;
  if (fromUnit === 'ml' && toUnit === 'L')  return qty / 1000;
  if (fromUnit === 'L'  && toUnit === 'ml') return qty * 1000;
  return qty; // incompatible units — return as-is
}

// Compatible use-units for each purchase unit
export function compatibleUnits(purchaseUnit) {
  if (purchaseUnit === 'kg' || purchaseUnit === 'g')  return ['g', 'kg'];
  if (purchaseUnit === 'L'  || purchaseUnit === 'ml') return ['ml', 'L'];
  return ['un'];
}

// Cost of one ingredient line item.
// catalog-linked: { qty, unit, purchasePrice, purchaseUnit }
// manual:         { qty, unit, price }  (price = per purchase unit, legacy logic)
export function calcIngredientLineCost(ing) {
  const qty = parseFloat(ing.qty) || 0;

  if (ing.purchasePrice !== undefined && ing.purchaseUnit) {
    const price = parseFloat(ing.purchasePrice) || 0;
    const qtyConverted = convertToUnit(qty, ing.unit, ing.purchaseUnit);
    return qtyConverted * price;
  }

  // legacy / manual entry
  const price = parseFloat(ing.price) || 0;
  switch (ing.unit) {
    case 'g':  return (qty / 1000) * price;
    case 'kg': return qty * price;
    case 'ml': return (qty / 1000) * price;
    case 'L':  return qty * price;
    default:   return qty * price;
  }
}

export function calcIngredientCost(ingredients) {
  return (ingredients || []).reduce((sum, ing) => sum + calcIngredientLineCost(ing), 0);
}
