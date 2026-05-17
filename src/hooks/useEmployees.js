import { useEmployeesStore, totalPayroll } from '../store/employeesStore';
import { useCostsStore } from '../store/costsStore';

export function useEmployees() {
  const store = useEmployeesStore();
  const costs = useCostsStore();

  const payroll = totalPayroll(store.employees);
  const workMinutes = (costs.workDays || 26) * (costs.hoursPerDay || 10) * 60;
  const laborCostPerMin = workMinutes > 0 ? payroll / workMinutes : 0;

  return {
    ...store,
    payroll,
    laborCostPerMin,
  };
}
