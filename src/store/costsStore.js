import { create } from 'zustand';

const STORAGE_KEY = 'cafe-costs';

const defaultState = {
  fixedCosts: {
    aluguel: 4500,
    folha: 5000,
    energia: 600,
    aguaGas: 350,
    internet: 150,
    delivery: 800,
    outros: 300,
  },
  rawMaterial: 8000,
  cardFeePercent: 2,
  revenue: 20000,
  workDays: 26,
  hoursPerDay: 10,
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return null;
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

const saved = loadFromStorage();
const initial = saved || defaultState;

export const useCostsStore = create((set) => ({
  ...initial,

  updateFixedCost: (key, value) =>
    set((state) => {
      const next = {
        ...state,
        fixedCosts: { ...state.fixedCosts, [key]: parseFloat(value) || 0 },
      };
      persist(next);
      return next;
    }),

  updateRawMaterial: (value) =>
    set((state) => {
      const next = { ...state, rawMaterial: parseFloat(value) || 0 };
      persist(next);
      return next;
    }),

  updateCardFee: (value) =>
    set((state) => {
      const next = { ...state, cardFeePercent: parseFloat(value) || 0 };
      persist(next);
      return next;
    }),

  updateRevenue: (value) =>
    set((state) => {
      const next = { ...state, revenue: parseFloat(value) || 0 };
      persist(next);
      return next;
    }),

  updateWorkDays: (value) =>
    set((state) => {
      const next = { ...state, workDays: parseInt(value) || 0 };
      persist(next);
      return next;
    }),

  updateHoursPerDay: (value) =>
    set((state) => {
      const next = { ...state, hoursPerDay: parseInt(value) || 0 };
      persist(next);
      return next;
    }),
}));

export function totalFixedCosts(state) {
  return Object.values(state.fixedCosts).reduce((sum, v) => sum + v, 0);
}
