import { create } from 'zustand';

const STORAGE_KEY = 'cafe-products';

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
const initial = saved || { products: [] };

export const useProductsStore = create((set) => ({
  ...initial,

  addProduct: (product) =>
    set((state) => {
      const next = {
        ...state,
        products: [...state.products, { ...product, id: Date.now(), savedAt: new Date().toISOString() }],
      };
      persist(next);
      return next;
    }),

  updateProduct: (id, data) =>
    set((state) => {
      const next = {
        ...state,
        products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
      };
      persist(next);
      return next;
    }),

  removeProduct: (id) =>
    set((state) => {
      const next = {
        ...state,
        products: state.products.filter((p) => p.id !== id),
      };
      persist(next);
      return next;
    }),
}));
