import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ProductTable from '../components/cardapio/ProductTable';
import { useProducts } from '../hooks/useProducts';

export default function Cardapio() {
  const { products, removeProduct } = useProducts();
  const count = products.length;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Cardápio"
        subtitle={count === 0 ? 'Nenhum produto cadastrado ainda' : `${count} produto${count !== 1 ? 's' : ''} cadastrado${count !== 1 ? 's' : ''}`}
      />
      <ProductTable products={products} onRemove={removeProduct} />
    </div>
  );
}
