/**
 * Computes cost per minute based on total monthly costs and working schedule.
 */
export function costPerMinute(totalMonthlyCost, workDays = 26, hoursPerDay = 10) {
  const totalMinutes = workDays * hoursPerDay * 60;
  if (totalMinutes === 0) return 0;
  return totalMonthlyCost / totalMinutes;
}

/**
 * Computes labor cost for a given prep time in minutes.
 */
export function laborCost(costPerMin, prepTimeMinutes) {
  return costPerMin * prepTimeMinutes;
}

/**
 * Computes total item cost (ingredients + packaging + labor).
 */
export function totalItemCost(ingredientCost, packagingCost, laborCostValue) {
  return ingredientCost + packagingCost + laborCostValue;
}

/**
 * Computes selling price given total cost and desired margin percentage (0-100).
 */
export function sellingPrice(totalCost, marginPercent) {
  const m = marginPercent / 100;
  if (m >= 1) return 0;
  return totalCost / (1 - m);
}

/**
 * Computes markup multiplier from margin percentage (0-100).
 */
export function markup(marginPercent) {
  const m = marginPercent / 100;
  if (m >= 1) return 0;
  return 1 / (1 - m);
}

/**
 * Computes break-even revenue needed.
 */
export function breakEven(fixedCosts, cmvPercent, cardFeePercent) {
  const cmv = cmvPercent / 100;
  const fee = cardFeePercent / 100;
  const denominator = 1 - cmv - fee;
  if (denominator <= 0) return 0;
  return fixedCosts / denominator;
}

/**
 * Computes CMV percentage (cost of goods sold as % of revenue).
 */
export function cmvPercent(rawMaterialCost, revenue) {
  if (revenue === 0) return 0;
  return (rawMaterialCost / revenue) * 100;
}

/**
 * Computes total ingredient cost from an array of ingredient objects.
 * Each ingredient: { qty, unit, price }
 * Units: g, kg, ml, L, un
 */
export function calcIngredientCost(ingredients) {
  return ingredients.reduce((sum, ing) => {
    const qty = parseFloat(ing.qty) || 0;
    const price = parseFloat(ing.price) || 0;
    let cost = 0;

    switch (ing.unit) {
      case 'g':
        cost = (qty / 1000) * price;
        break;
      case 'kg':
        cost = qty * price;
        break;
      case 'ml':
        cost = (qty / 1000) * price;
        break;
      case 'L':
        cost = qty * price;
        break;
      case 'un':
        cost = qty * price;
        break;
      default:
        cost = 0;
    }

    return sum + cost;
  }, 0);
}
