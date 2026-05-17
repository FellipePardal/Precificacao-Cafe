/**
 * Formats a number as Brazilian Real currency.
 * Example: 1234.56 → "R$ 1.234,56"
 */
export function formatBRL(value) {
  const num = parseFloat(value) || 0;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formats a number as a percentage with one decimal place.
 * Example: 40 → "40,0%"
 */
export function formatPct(value) {
  const num = parseFloat(value) || 0;
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + '%';
}

/**
 * Formats a markup multiplier.
 * Example: 1.6667 → "1,67x"
 */
export function formatMarkup(value) {
  const num = parseFloat(value) || 0;
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + 'x';
}
