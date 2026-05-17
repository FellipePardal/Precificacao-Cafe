import { useProductsStore } from '../store/productsStore';

export function useProducts() {
  return useProductsStore();
}
