import React from 'react';
import { sellingPrice } from '../../utils/pricing';
import { formatBRL } from '../../utils/formatters';

const custos = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const margens = [20, 25, 30, 35, 40, 45, 50];

export default function MarkupTable() {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-serif text-base text-dark">Tabela de Referência de Preços</h2>
        <p className="text-xs text-muted mt-0.5">Preço de venda sugerido por custo e margem (coluna 40% destacada)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface2 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                Custo
              </th>
              {margens.map((m) => (
                <th
                  key={m}
                  className={`text-center px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                    m === 40 ? 'bg-accent-light text-accent' : 'text-muted'
                  }`}
                >
                  {m}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {custos.map((c, i) => (
              <tr key={c} className={`border-b border-border ${i % 2 === 1 ? 'bg-surface2/50' : ''}`}>
                <td className="px-4 py-2.5 text-sm font-semibold text-dark">{formatBRL(c)}</td>
                {margens.map((m) => (
                  <td
                    key={m}
                    className={`text-center px-4 py-2.5 text-sm ${
                      m === 40
                        ? 'bg-accent-light text-accent font-semibold'
                        : 'text-dark'
                    }`}
                  >
                    {formatBRL(sellingPrice(c, m))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
