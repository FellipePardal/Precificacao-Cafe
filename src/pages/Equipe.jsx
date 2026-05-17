import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { useEmployees } from '../hooks/useEmployees';
import { formatBRL } from '../utils/formatters';
import { useCostsStore } from '../store/costsStore';

const ROLES = ['Barista', 'Cozinheiro(a)', 'Atendente', 'Caixa', 'Auxiliar de Cozinha', 'Gerente', 'Outros'];

function empty() {
  return { name: '', role: '', salary: '' };
}

const labelCls  = 'text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5 block';
const inputCls  = 'border border-border rounded-lg px-3 py-2.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-accent/30';
const selectCls = inputCls;

export default function Equipe() {
  const { employees, addEmployee, updateEmployee, removeEmployee, payroll, laborCostPerMin } = useEmployees();
  const { workDays, hoursPerDay } = useCostsStore();
  const [form, setForm] = useState(empty());
  const [editId, setEditId] = useState(null);

  function set(f, v) { setForm((p) => ({ ...p, [f]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.salary) return;
    const payload = { name: form.name.trim(), role: form.role, salary: parseFloat(form.salary) };
    if (editId) { updateEmployee(editId, payload); setEditId(null); }
    else        { addEmployee(payload); }
    setForm(empty());
  }

  function startEdit(emp) {
    setForm({ name: emp.name, role: emp.role || '', salary: String(emp.salary || '') });
    setEditId(emp.id);
  }

  function cancelEdit() { setForm(empty()); setEditId(null); }

  const workMinutes = (workDays || 26) * (hoursPerDay || 10) * 60;
  const costPerHour = workMinutes > 0 ? payroll / ((workDays || 26) * (hoursPerDay || 10)) : 0;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Equipe"
        subtitle="Cadastre os funcionários — o custo de mão de obra das fichas técnicas é calculado a partir da folha real"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Folha Mensal</p>
          <p className="text-2xl font-semibold text-dark tabular-nums">{formatBRL(payroll)}</p>
          <p className="text-xs text-muted mt-1">{employees.length} funcionário{employees.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Custo/Hora</p>
          <p className="text-2xl font-semibold text-dark tabular-nums">{formatBRL(costPerHour)}</p>
          <p className="text-xs text-muted mt-1">{workDays || 26} dias × {hoursPerDay || 10}h/dia</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Custo/Minuto</p>
          <p className="text-2xl font-semibold text-accent2 tabular-nums">{formatBRL(laborCostPerMin)}</p>
          <p className="text-xs text-muted mt-1">usado nas fichas técnicas</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-5 animate-fade-up">
        <h2 className="font-serif text-base text-dark mb-4">{editId ? 'Editar Funcionário' : 'Adicionar Funcionário'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Nome</label>
            <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Mel, Ju..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Função</label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)} className={selectCls}>
              <option value="">Selecione...</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Salário + Encargos (R$)</label>
            <input required type="number" min="0" step="0.01" value={form.salary}
              onChange={(e) => set('salary', e.target.value)}
              placeholder="Ex: 2000,00" className={inputCls} />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit"
              className="flex-1 bg-accent text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
              {editId ? 'Salvar' : '+ Adicionar'}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit}
                className="px-3 py-2.5 text-sm font-medium text-muted border border-border rounded-lg hover:bg-surface transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border animate-fade-up delay-1">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-dark">
            {employees.length} funcionário{employees.length !== 1 ? 's' : ''} cadastrado{employees.length !== 1 ? 's' : ''}
          </p>
        </div>
        {employees.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif text-lg text-muted">Nenhum funcionário cadastrado</p>
            <p className="text-sm text-muted/70 mt-1">Adicione os funcionários para calcular o custo de mão de obra real.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface border-b border-border">
                {['Nome', 'Função', 'Salário + Encargos', 'Custo/Hora', 'Custo/Min'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest">{h}</th>
                ))}
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const empCostPerMin = workMinutes > 0 ? (parseFloat(emp.salary) || 0) / workMinutes : 0;
                const empCostPerHour = (workDays || 26) * (hoursPerDay || 10) > 0
                  ? (parseFloat(emp.salary) || 0) / ((workDays || 26) * (hoursPerDay || 10))
                  : 0;
                return (
                  <tr key={emp.id} className={`border-b border-border/60 hover:bg-surface/60 transition-colors ${editId === emp.id ? 'bg-accent-light' : ''}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-dark">{emp.name}</td>
                    <td className="px-4 py-3">
                      {emp.role
                        ? <span className="text-xs font-medium text-muted bg-surface2 px-2.5 py-1 rounded-full">{emp.role}</span>
                        : <span className="text-xs text-light">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-dark tabular-nums">{formatBRL(emp.salary)}</td>
                    <td className="px-4 py-3 text-sm text-muted tabular-nums">{formatBRL(empCostPerHour)}/h</td>
                    <td className="px-4 py-3 text-sm text-accent2 font-semibold tabular-nums">{formatBRL(empCostPerMin)}/min</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => startEdit(emp)}
                          className="text-muted hover:text-accent p-1.5 rounded-lg hover:bg-accent-light transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button onClick={() => removeEmployee(emp.id)}
                          className="text-muted hover:text-danger p-1.5 rounded-lg hover:bg-danger-light transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
