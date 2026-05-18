import { useCostsStore, totalFixedCosts } from '../store/costsStore';
import { useEmployees } from './useEmployees';
import { breakEven, cmvPercent } from '../utils/pricing';

const EMPTY_FC = { aluguel: 0, energia: 0, aguaGas: 0, internet: 0, delivery: 0, outros: 0 };

export function useCosts() {
  const store = useCostsStore();
  const { payroll, laborCostPerMin } = useEmployees();

  const { selectedMonth, monthlyData, workDays, hoursPerDay, cardFeePercent } = store;
  const md = monthlyData[selectedMonth] || { fixedCosts: EMPTY_FC, rawMaterial: 0, revenue: 0 };

  const { fixedCosts, rawMaterial, revenue } = md;
  const totalFixed = totalFixedCosts(fixedCosts) + payroll;
  const totalMonthlyCost = totalFixed + rawMaterial;
  const cmv = cmvPercent(rawMaterial, revenue);
  const breakEvenValue = breakEven(totalFixed, cmv, cardFeePercent);

  return {
    ...store,
    fixedCosts,
    rawMaterial,
    revenue,
    payroll,
    totalFixed,
    totalMonthlyCost,
    costPerMin: laborCostPerMin,
    cmv,
    breakEvenValue,
  };
}
