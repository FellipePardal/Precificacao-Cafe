import { create } from 'zustand';

const STORAGE_KEY = 'cafe-ingredients';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function save(ingredients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
}

export const useIngredientsStore = create((set) => ({
  ingredients: load(),

  addIngredient(ingredient) {
    set((s) => {
      const updated = [...s.ingredients, { ...ingredient, id: crypto.randomUUID() }];
      save(updated);
      return { ingredients: updated };
    });
  },

  updateIngredient(id, data) {
    set((s) => {
      const updated = s.ingredients.map((i) => (i.id === id ? { ...i, ...data } : i));
      save(updated);
      return { ingredients: updated };
    });
  },

  removeIngredient(id) {
    set((s) => {
      const updated = s.ingredients.filter((i) => i.id !== id);
      save(updated);
      return { ingredients: updated };
    });
  },
}));
