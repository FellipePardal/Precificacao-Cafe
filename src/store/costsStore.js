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
export const VARIABLE_KEYS = ['mercado', 'feira', 'hortifruti', 'salgados', 'doces', 'outros'];

const DEFAULT_FIXED = { aluguel: 4500, energia: 600, aguaGas: 350, internet: 150, outros: 300 };

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function defaultItems(value) {
  return value > 0 ? [{ id: newId(), label: 'Compra', value }] : [];
}

const DEFAULT_VARIABLE = {
  mercado:    [{ id: 'def-m1', label: 'Compra', value: 4000 }],
  feira:      [{ id: 'def-f1', label: 'Compra', value: 1000 }],
  hortifruti: [{ id: 'def-h1', label: 'Compra', value: 800 }],
  salgados:   [{ id: 'def-s1', label: 'Compra', value: 1000 }],
  doces:      [{ id: 'def-d1', label: 'Compra', value: 800 }],
  outros:     [{ id: 'def-o1', label: 'Compra', value: 400 }],
};

const DEFAULT_MONTH = { fixedCosts: { ...DEFAULT_FIXED }, variableCosts: DEFAULT_VARIABLE, revenue: 20000 };

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

// Normaliza variableCosts: converte números (formato antigo) para arrays
function normalizeVariableCosts(vc) {
  if (!vc) return deepCopy(DEFAULT_VARIABLE);
  const result = {};
  VARIABLE_KEYS.forEach((k) => {
    const v = vc[k];
    if (Array.isArray(v)) {
      result[k] = v;
    } else if (typeof v === 'number') {
      result[k] = defaultItems(v);
    } else {
      result[k] = [];
    }
  });
  return result;
}

function migrateMonthEntry(entry) {
  return {
    fixedCosts:    entry.fixedCosts    || { ...DEFAULT_FIXED },
    variableCosts: normalizeVariableCosts(entry.variableCosts),
    revenue:       entry.revenue       ?? 20000,
  };
}

function migrate(saved) {
  if (!saved) return null;

  if (saved.monthlyData) {
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
        variableCosts: normalizeVariableCosts(saved.variableCosts || { mercado: saved.rawMaterial ?? 4000 }),
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

  // Adiciona um novo item a uma categoria de custo variável
  addVariableItem(key, label = 'Nova compra') {
    set((s) => {
      const ym = s.selectedMonth;
      let next = ensureMonth(s, ym);
      const vc    = next.monthlyData[ym].variableCosts;
      const items = Array.isArray(vc[key]) ? vc[key] : [];
      next = {
        ...next,
        monthlyData: {
          ...next.monthlyData,
          [ym]: {
            ...next.monthlyData[ym],
            variableCosts: { ...vc, [key]: [...items, { id: newId(), label, value: 0 }] },
          },
        },
      };
      persist(next);
      return next;
    });
  },

  // Atualiza label ou value de um item
  updateVariableItem(key, id, field, value) {
    set((s) => {
      const ym = s.selectedMonth;
      let next = ensureMonth(s, ym);
      const vc    = next.monthlyData[ym].variableCosts;
      const items = Array.isArray(vc[key]) ? vc[key] : [];
      const parsed = field === 'value' ? parseFloat(value) || 0 : value;
      next = {
        ...next,
        monthlyData: {
          ...next.monthlyData,
          [ym]: {
            ...next.monthlyData[ym],
            variableCosts: {
              ...vc,
              [key]: items.map((item) => item.id === id ? { ...item, [field]: parsed } : item),
            },
          },
        },
      };
      persist(next);
      return next;
    });
  },

  // Remove um item de uma categoria
  removeVariableItem(key, id) {
    set((s) => {
      const ym = s.selectedMonth;
      let next = ensureMonth(s, ym);
      const vc    = next.monthlyData[ym].variableCosts;
      const items = Array.isArray(vc[key]) ? vc[key] : [];
      next = {
        ...next,
        monthlyData: {
          ...next.monthlyData,
          [ym]: {
            ...next.monthlyData[ym],
            variableCosts: { ...vc, [key]: items.filter((item) => item.id !== id) },
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

export function categoryTotal(variableCosts, key) {
  const v = variableCosts?.[key];
  if (Array.isArray(v)) return v.reduce((s, item) => s + (item.value || 0), 0);
  return typeof v === 'number' ? v : 0;
}

export function totalVariableCosts(variableCosts) {
  return VARIABLE_KEYS.reduce((sum, k) => sum + categoryTotal(variableCosts, k), 0);
}
