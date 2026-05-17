import { useCostsStore, totalFixedCosts } from '../store/costsStore';
import { useEmployees } from './useEmployees';
import { breakEven, cmvPercent } from '../utils/pricing';

export function useCosts() {
  const store = useCostsStore();
  const { payroll, laborCostPerMin } = useEmployees();

  // replace folha in fixedCosts with the real payroll from employees
  const storeWithRealPayroll = {
    ...store,
    fixedCosts: { ...store.fixedCosts, folha: payroll },
  };
  const totalFixed = totalFixedCosts(storeWithRealPayroll);
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
