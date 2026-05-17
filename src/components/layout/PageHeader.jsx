import React from 'react';

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6 pb-4 border-b border-border animate-fade-up">
      <h1 className="font-serif text-2xl text-dark">{title}</h1>
      {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}
