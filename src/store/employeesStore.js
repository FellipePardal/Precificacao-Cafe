import { create } from 'zustand';

const KEY = 'cafe-employees';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export const useEmployeesStore = create((set) => ({
  employees: load(),

  addEmployee(emp) {
    set((s) => {
      const updated = [...s.employees, { ...emp, id: crypto.randomUUID() }];
      save(updated);
      return { employees: updated };
    });
  },

  updateEmployee(id, data) {
    set((s) => {
      const updated = s.employees.map((e) => (e.id === id ? { ...e, ...data } : e));
      save(updated);
      return { employees: updated };
    });
  },

  removeEmployee(id) {
    set((s) => {
      const updated = s.employees.filter((e) => e.id !== id);
      save(updated);
      return { employees: updated };
    });
  },
}));

export function totalPayroll(employees) {
  return employees.reduce((sum, e) => sum + (parseFloat(e.salary) || 0), 0);
}
