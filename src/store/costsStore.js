import { create } from 'zustand';

const STORAGE_KEY = 'cafe-costs';

export function ymNow() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function prevYM(ym) {
  const [y, m] = ym.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
}

export function nextYM(ym) {
  const [y, m] = ym.split('-').map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

export function ymLabel(ym) {
  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

const DEFAULT_FIXED = { aluguel: 4500, energia: 600, aguaGas: 350, internet: 150, delivery: 800, outros: 300 };
const DEFAULT_MONTH = { fixedCosts: { ...DEFAULT_FIXED }, rawMaterial: 8000, revenue: 20000 };

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

function migrate(saved) {
  if (!saved) return null;
  if (saved.monthlyData) return saved;
  const ym = ymNow();
  const fc = { ...DEFAULT_FIXED };
  if (saved.fixedCosts) {
    ['aluguel','energia','aguaGas','internet','delivery','outros'].forEach((k) => {
      if (saved.fixedCosts[k] != null) fc[k] = saved.fixedCosts[k];
    });
  }
  return {
    workDays:       saved.workDays      ?? 22,
    hoursPerDay:    saved.hoursPerDay   ?? 10,
    cardFeePercent: saved.cardFeePercent ?? 2,
    selectedMonth:  ym,
    monthlyData: {
      [ym]: { fixedCosts: fc, rawMaterial: saved.rawMaterial ?? 8000, revenue: saved.revenue ?? 20000 },
    },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch { }
  return null;
}

function persist(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { }
}

function ensureMonth(state, ym) {
  if (state.monthlyData[ym]) return state;
  const source = state.monthlyData[prevYM(ym)] ?? DEFAULT_MONTH;
  return {
    ...state,
    monthlyData: { ...state.monthlyData, [ym]: deepCopy(source) },
  };
}

const initial = load() || {
  workDays: 22, hoursPerDay: 10, cardFeePercent: 2,
  selectedMonth: ymNow(),
  monthlyData: { [ymNow()]: deepCopy(DEFAULT_MONTH) },
};

export const useCostsStore = create((set) => ({
  ...initial,

  setSelectedMonth(ym) {
    set((s) => {
      let next = ensureMonth(s, ym);
      next = { ...next, selectedMonth: ym };
      persist(next);
      return next;
    });
  },

  updateFixedCost(key, value) {
    set((s) => {
      const ym = s.selectedMonth;
      let next = ensureMonth(s, ym);
      next = {
        ...next,
        monthlyData: {
          ...next.monthlyData,
          [ym]: {
            ...next.monthlyData[ym],
            fixedCosts: { ...next.monthlyData[ym].fixedCosts, [key]: parseFloat(value) || 0 },
          },
        },
      };
      persist(next);
      return next;
    });
  },

  updateRawMaterial(value) {
    set((s) => {
      const ym = s.selectedMonth;
      let next = ensureMonth(s, ym);
      next = {
        ...next,
        monthlyData: {
          ...next.monthlyData,
          [ym]: { ...next.monthlyData[ym], rawMaterial: parseFloat(value) || 0 },
        },
      };
      persist(next);
      return next;
    });
  },

  updateRevenue(value) {
    set((s) => {
      const ym = s.selectedMonth;
      let next = ensureMonth(s, ym);
      next = {
        ...next,
        monthlyData: {
          ...next.monthlyData,
          [ym]: { ...next.monthlyData[ym], revenue: parseFloat(value) || 0 },
        },
      };
      persist(next);
      return next;
    });
  },

  updateCardFee(value) {
    set((s) => { const next = { ...s, cardFeePercent: parseFloat(value) || 0 }; persist(next); return next; });
  },

  updateWorkDays(value) {
    set((s) => { const next = { ...s, workDays: parseInt(value) || 0 }; persist(next); return next; });
  },

  updateHoursPerDay(value) {
    set((s) => { const next = { ...s, hoursPerDay: parseInt(value) || 0 }; persist(next); return next; });
  },
}));

export function totalFixedCosts(fixedCosts) {
  return Object.values(fixedCosts || {}).reduce((sum, v) => sum + (v || 0), 0);
}
