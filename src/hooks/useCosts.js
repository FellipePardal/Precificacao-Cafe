import { useCostsStore, totalFixedCosts } from '../store/costsStore';
import { useEmployees } from './useEmployees';
import { breakEven, cmvPercent } from '../utils/pricing';

export function useCosts() {
  const store = useCostsStore();
  const { payroll, laborCostPerMin } = useEmployees();

  const totalFixed = totalFixedCosts(store);
  const totalMonthlyCost = totalFixed + store.rawMaterial;
  const cmv = cmvPercent(store.rawMaterial, store.revenue);
  const breakEvenValue = breakEven(totalFixed, cmv, store.cardFeePercent);

  return {
    ...store,
    totalFixed,
    totalMonthlyCost,
    payroll,
    costPerMin: laborCostPerMin,
    cmv,
    breakEvenValue,
  };
}
