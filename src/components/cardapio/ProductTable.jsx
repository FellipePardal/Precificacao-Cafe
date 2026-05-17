import React from 'react';
import ProductRow from './ProductRow';

export default function ProductTable({ products, onRemove }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border shadow-sm p-16 text-center animate-fade-up delay-1">
        <div className="w-14 h-14 rounded-2xl bg-surface2 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-light" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <p className="font-serif text-xl text-muted">Cardápio vazio</p>
        <p className="text-sm text-muted/70 mt-2 max-w-xs mx-auto">
          Crie fichas técnicas na aba <strong className="text-muted">Ficha Técnica</strong> e salve os produtos aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden animate-fade-up delay-1">
      <table className="w-full">
        <thead>
          <tr className="bg-surface2 border-b border-border">
            {['Produto', 'Categoria', 'Custo', 'Preço Sugerido', 'Margem', 'Status', ''].map((h, i) => (
              <th key={i} className={`px-4 py-3.5 text-[11px] font-semibold text-muted uppercase tracking-widest ${i === 0 ? 'text-left' : i === 6 ? 'w-12' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <ProductRow key={product.id} product={product} onRemove={onRemove} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
