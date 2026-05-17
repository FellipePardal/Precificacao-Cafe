import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ProductForm from '../components/ficha/ProductForm';
import PricingResult from '../components/ficha/PricingResult';
import { usePricing } from '../hooks/usePricing';
import { useProducts } from '../hooks/useProducts';

function emptyProduct() {
  return { name: '', category: '', portions: 1, prepTime: '', packaging: '', ingredients: [], margin: 40 };
}

export default function FichaTecnica() {
  const [product, setProduct] = useState(emptyProduct());
  const { addProduct } = useProducts();

  const pricing = usePricing({
    ingredients: product.ingredients,
    prepTime: product.prepTime,
    packaging: product.packaging,
    margin: product.margin,
  });

  function handleSave() {
    if (!product.name.trim()) {
      alert('Informe o nome do produto antes de salvar.');
      return;
    }
    addProduct({ ...product, ...pricing });
    setProduct(emptyProduct());
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader title="Ficha Técnica" subtitle="Monte a ficha técnica e calcule o preço ideal" />
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0">
          <ProductForm value={product} onChange={setProduct} />
        </div>
        <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-6">
          <PricingResult
            ingredientCost={pricing.ingredientCost}
            laborCost={pricing.laborCostValue}
            totalCost={pricing.totalCost}
            suggestedPrice={pricing.suggestedPrice}
            markupValue={pricing.markupValue}
            profitPerSale={pricing.profitPerSale}
            margin={product.margin}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
