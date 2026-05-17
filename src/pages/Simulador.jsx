import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ModoSugestao from '../components/simulador/ModoSugestao';
import ModoValidacao from '../components/simulador/ModoValidacao';
import MarkupTable from '../components/simulador/MarkupTable';

const tabs = [
  { id: 'sugestao',  label: 'Sugestão de Preço' },
  { id: 'validacao', label: 'Validar Preço Atual' },
];

export default function Simulador() {
  const [activeTab, setActiveTab] = useState('sugestao');

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <PageHeader title="Simulador de Preço" subtitle="Calcule e valide preços de venda" />

      <div className="bg-surface rounded-xl border border-border shadow-sm p-5 animate-fade-up delay-1">
        <div className="flex gap-1 mb-6 bg-surface2 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-surface text-dark shadow-sm'
                  : 'text-muted hover:text-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'sugestao' ? <ModoSugestao /> : <ModoValidacao />}
      </div>

      <MarkupTable />
    </div>
  );
}
