import { useCostsStore, totalFixedCosts } from '../store/costsStore';
import {
  costPerMinute,
  breakEven,
  cmvPercent,
} from '../utils/pricing';

export function useCosts() {
  const store = useCostsStore();

  const totalFixed = totalFixedCosts(store);
  const totalMonthlyCost = totalFixed + store.rawMaterial;
  const costPerMin = costPerMinute(totalMonthlyCost, store.workDays, store.hoursPerDay);
  const cmv = cmvPercent(store.rawMaterial, store.revenue);
  const breakEvenValue = breakEven(totalFixed, cmv, store.cardFeePercent);

  return {
    ...store,
    totalFixed,
    totalMonthlyCost,
    costPerMin,
    cmv,
    breakEvenValue,
  };
}
