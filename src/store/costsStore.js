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

const FIXED_KEYS    = ['aluguel', 'energia', 'aguaGas', 'internet', 'outros'];
const VARIABLE_KEYS = ['mercado', 'feira', 'hortifruti', 'salgados', 'doces', 'outros'];

const DEFAULT_FIXED    = { aluguel: 4500, energia: 600, aguaGas: 350, internet: 150, outros: 300 };
const DEFAULT_VARIABLE = { mercado: 4000, feira: 1000, hortifruti: 800, salgados: 1000, doces: 800, outros: 400 };
const DEFAULT_MONTH    = { fixedCosts: { ...DEFAULT_FIXED }, variableCosts: { ...DEFAULT_VARIABLE }, revenue: 20000 };

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

function migrateMonthEntry(entry) {
  if (entry.variableCosts) return entry;
  // old format had rawMaterial — move it to mercado
  return {
    fixedCosts:    entry.fixedCosts || { ...DEFAULT_FIXED },
    variableCosts: { ...DEFAULT_VARIABLE, mercado: entry.rawMaterial ?? 4000 },
    revenue:       entry.revenue ?? 20000,
  };
}

function migrate(saved) {
  if (!saved) return null;

  // already new top-level format
  if (saved.monthlyData) {
    // still need to migrate individual month entries that predate variableCosts
    const monthlyData = {};
    Object.entries(saved.monthlyData).forEach(([ym, entry]) => {
      monthlyData[ym] = migrateMonthEntry(entry);
    });
    return { ...saved, monthlyData };
  }

  // very old flat format
  const ym = ymNow();
  const fc = { ...DEFAULT_FIXED };
  if (saved.fixedCosts) {
    FIXED_KEYS.forEach((k) => { if (saved.fixedCosts[k] != null) fc[k] = saved.fixedCosts[k]; });
  }
  return {
    workDays:       saved.workDays       ?? 22,
    hoursPerDay:    saved.hoursPerDay    ?? 10,
    cardFeePercent: saved.cardFeePercent ?? 2,
    selectedMonth:  ym,
    monthlyData: {
      [ym]: {
        fixedCosts:    fc,
        variableCosts: { ...DEFAULT_VARIABLE, mercado: saved.rawMaterial ?? 4000 },
        revenue:       saved.revenue ?? 20000,
      },
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

  updateVariableCost(key, value) {
    set((s) => {
      const ym = s.selectedMonth;
      let next = ensureMonth(s, ym);
      next = {
        ...next,
        monthlyData: {
          ...next.monthlyData,
          [ym]: {
            ...next.monthlyData[ym],
            variableCosts: { ...next.monthlyData[ym].variableCosts, [key]: parseFloat(value) || 0 },
          },
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
  return FIXED_KEYS.reduce((sum, k) => sum + (fixedCosts?.[k] || 0), 0);
}

export function totalVariableCosts(variableCosts) {
  return VARIABLE_KEYS.reduce((sum, k) => sum + (variableCosts?.[k] || 0), 0);
}
