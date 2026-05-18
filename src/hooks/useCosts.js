import { useCostsStore, totalFixedCosts, totalVariableCosts } from '../store/costsStore';
import { useEmployees } from './useEmployees';
import { breakEven, cmvPercent } from '../utils/pricing';

const EMPTY_FC = { aluguel: 0, energia: 0, aguaGas: 0, internet: 0, outros: 0 };
const EMPTY_VC = { mercado: 0, feira: 0, hortifruti: 0, salgados: 0, doces: 0, outros: 0 };

export function useCosts() {
  const store = useCostsStore();
  const { payroll, laborCostPerMin } = useEmployees();

  const { selectedMonth, monthlyData, workDays, hoursPerDay, cardFeePercent } = store;
  const md = monthlyData[selectedMonth] || { fixedCosts: EMPTY_FC, variableCosts: EMPTY_VC, revenue: 0 };

  const { fixedCosts, variableCosts, revenue } = md;
  const rawMaterial   = totalVariableCosts(variableCosts);
  const totalFixed    = totalFixedCosts(fixedCosts) + payroll;
  const totalMonthlyCost = totalFixed + rawMaterial;
  const cmv           = cmvPercent(rawMaterial, revenue);
  const breakEvenValue = breakEven(totalFixed, cmv, cardFeePercent);

  return {
    ...store,
    fixedCosts,
    variableCosts,
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
