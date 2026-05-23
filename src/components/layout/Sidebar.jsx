import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const BROWN        = '#3D2010';
const BROWN_HOVER  = '#4F2A14';
const GREEN_ACTIVE = '#286044';

const ICONS = {
  painel: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  custosFixos: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  custosVariaveis: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
    </svg>
  ),
  receitas: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
    </svg>
  ),
  ingredientes: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  ),
  ficha: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    </svg>
  ),
  cardapio: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
    </svg>
  ),
  equipe: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ),
};

function NavItem({ item, sub = false }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <NavLink
      to={item.to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 10,
        padding: sub ? '7px 12px 7px 16px' : '9px 12px',
        borderRadius: 8,
        fontSize: sub ? 12.5 : 13,
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'background 0.15s',
        backgroundColor: isActive ? GREEN_ACTIVE : hovered ? BROWN_HOVER : 'transparent',
        color: isActive ? '#fff' : hovered ? 'rgba(255,255,255,0.9)' : sub ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.5)',
      })}
    >
      {sub && (
        <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'currentColor', flexShrink: 0, marginLeft: 2 }} />
      )}
      {!sub && item.icon}
      {sub && item.icon}
      {item.label}
    </NavLink>
  );
}

function NavGroup({ label, items }) {
  const location = useLocation();
  const isGroupActive = items.some(item => location.pathname.startsWith(item.to));

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px 4px',
        marginTop: 8,
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isGroupActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.15s',
        }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map(item => <NavItem key={item.to} item={item} sub />)}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside style={{ backgroundColor: BROWN, width: 210, minHeight: '100vh', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontFamily: '"DM Serif Display", serif', color: '#fff', fontSize: '1.1rem', lineHeight: 1, margin: 0 }}>Coffee & Cake</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.05em' }}>Precificação</p>
      </div>

      <nav style={{ flex: 1, padding: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Painel */}
          <NavItem item={{ to: '/painel', label: 'Painel', icon: ICONS.painel }} />

          {/* Grupo Operações */}
          <NavGroup
            label="Operações"
            items={[
              { to: '/operacoes/custos-fixos',    label: 'Custos Fixos',      icon: ICONS.custosFixos },
              { to: '/operacoes/custos-variaveis', label: 'Custos Variáveis',  icon: ICONS.custosVariaveis },
              { to: '/operacoes/receitas',         label: 'Receitas e Entradas', icon: ICONS.receitas },
            ]}
          />

          {/* Restante */}
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <NavItem item={{ to: '/ingredientes', label: 'Ingredientes',  icon: ICONS.ingredientes }} />
            <NavItem item={{ to: '/ficha',        label: 'Ficha Técnica', icon: ICONS.ficha }} />
            <NavItem item={{ to: '/cardapio',     label: 'Cardápio',      icon: ICONS.cardapio }} />
            <NavItem item={{ to: '/equipe',       label: 'Equipe',        icon: ICONS.equipe }} />
          </div>

        </div>
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>v1.0</p>
      </div>
    </aside>
  );
}
