import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Painel from './pages/Painel';
import Custos from './pages/Custos';
import Ingredientes from './pages/Ingredientes';
import FichaTecnica from './pages/FichaTecnica';
import Cardapio from './pages/Cardapio';
import Equipe from './pages/Equipe';
import CustosVariaveis from './pages/CustosVariaveis';
import Receitas from './pages/Receitas';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#FAFAF8' }}>
        <Routes>
          <Route path="/"             element={<Navigate to="/painel" replace />} />
          <Route path="/painel"       element={<Painel />} />

          {/* Operações */}
          <Route path="/operacoes/custos-fixos"    element={<Custos />} />
          <Route path="/operacoes/custos-variaveis" element={<CustosVariaveis />} />
          <Route path="/operacoes/receitas"        element={<Receitas />} />

          {/* Redirecionamentos das rotas antigas */}
          <Route path="/custos"   element={<Navigate to="/operacoes/custos-fixos" replace />} />
          <Route path="/compras"  element={<Navigate to="/operacoes/custos-variaveis" replace />} />

          <Route path="/ingredientes" element={<Ingredientes />} />
          <Route path="/ficha"        element={<FichaTecnica />} />
          <Route path="/cardapio"     element={<Cardapio />} />
          <Route path="/equipe"       element={<Equipe />} />
        </Routes>
      </main>
    </div>
  );
}
