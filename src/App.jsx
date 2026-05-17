import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Painel from './pages/Painel';
import Custos from './pages/Custos';
import FichaTecnica from './pages/FichaTecnica';
import Cardapio from './pages/Cardapio';
import Simulador from './pages/Simulador';

export default function App() {
  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-bg">
        <Routes>
          <Route path="/" element={<Navigate to="/painel" replace />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/custos" element={<Custos />} />
          <Route path="/ficha" element={<FichaTecnica />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/simulador" element={<Simulador />} />
        </Routes>
      </main>
    </div>
  );
}
