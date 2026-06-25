import { Link, useLocation } from 'react-router-dom';
import { Home, Grid2X2, Heart, User } from 'lucide-react';

const items = [
  { label: 'Início',     to: '/',            icon: Home },
  { label: 'Categorias', to: '/categorias',   icon: Grid2X2 },
  { label: 'Favoritos',  to: '/favoritos',    icon: Heart },
  { label: 'Conta',      to: '/conta',        icon: User },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav md:hidden">
      {items.map(({ label, to, icon: Icon }) => (
        <Link key={to} to={to}
          className={`bottom-nav-item no-underline ${pathname === to ? 'active' : ''}`}>
          <Icon size={20} strokeWidth={2.2} />
          <span className="bottom-nav-label">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
