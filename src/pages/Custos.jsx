import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import CostForm from '../components/custos/CostForm';
import CostSummary from '../components/custos/CostSummary';

export default function Custos() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <PageHeader
        title="Custos Fixos"
        subtitle="Gerencie todos os seus custos mensais"
      />
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0">
          <CostForm />
        </div>
        <div className="w-full lg:w-72 shrink-0">
          <CostSummary />
        </div>
      </div>
    </div>
  );
}
