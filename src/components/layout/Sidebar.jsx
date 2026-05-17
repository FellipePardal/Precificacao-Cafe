import React from 'react';
import { NavLink } from 'react-router-dom';

const BROWN = '#3D2010';
const BROWN_HOVER = '#4F2A14';
const GREEN_ACTIVE = '#286044';

const navItems = [
  {
    to: '/painel', label: 'Painel',
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    to: '/custos', label: 'Custos Fixos',
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    to: '/ficha', label: 'Ficha Técnica',
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  },
  {
    to: '/cardapio', label: 'Cardápio',
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>,
  },
  {
    to: '/simulador', label: 'Simulador',
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6M9 12h6M9 16h4"/></svg>,
  },
];

function NavItem({ item }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <NavLink
      to={item.to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'background 0.15s',
        backgroundColor: isActive ? GREEN_ACTIVE : hovered ? BROWN_HOVER : 'transparent',
        color: isActive ? '#fff' : hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
      })}
    >
      {item.icon}
      {item.label}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside
      style={{ backgroundColor: BROWN, width: 210, minHeight: '100vh', flexShrink: 0, display: 'flex', flexDirection: 'column' }}
    >
      {/* Brand */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontFamily: '"DM Serif Display", serif', color: '#fff', fontSize: '1.1rem', lineHeight: 1, margin: 0 }}>Coffee & Cake</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.05em' }}>Precificação</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => <NavItem key={item.to} item={item} />)}
        </div>
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>v1.0</p>
      </div>
    </aside>
  );
}
