import { Link, useLocation } from 'react-router-dom';

const links = [
  { label: 'INÍCIO',      to: '/' },
  { label: 'MASCULINO',   to: '/categoria/masculino' },
  { label: 'FEMININO',    to: '/categoria/feminino' },
  { label: 'INFANTIL',    to: '/categoria/infantil' },
  { label: 'PERFUMARIA',  to: '/categoria/perfumaria' },
  { label: 'COPA 2026',   to: '/categoria/copa-2026', isCopa: true, isNew: true },
  { label: 'OUTLET',      to: '/categoria/outlet', isOutlet: true },
  { label: 'SOBRE NÓS',   to: '/sobre' },
];

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className="hidden md:block" style={{
      background: '#080808',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44, gap: 4 }}>
        {links.map(link => {
          const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '0 14px', height: '100%',
                fontSize: 11.5, fontWeight: 700, letterSpacing: '0.09em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: isActive ? '#fff' : (link.isCopa ? '#FFB800' : '#666'),

                position: 'relative',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = link.isCopa ? '#FFB800' : '#ccc'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = link.isCopa ? '#FFB800' : '#666'; }}
            >
              {/* Active/hover underline */}
              <span style={{
                position: 'absolute', bottom: 0, left: 14, right: 14, height: 2,
                background: link.isCopa ? '#FFB800' : 'linear-gradient(90deg, #a855f7, #FF2DA0)',
                borderRadius: '2px 2px 0 0',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'opacity 0.2s, transform 0.2s',
                transformOrigin: 'center',
              }} />

              {link.label}

              {link.isNew && (
                <span style={{
                  fontSize: 8, fontWeight: 900, padding: '2px 5px', borderRadius: 3,
                  background: 'linear-gradient(135deg, #a855f7, #FF2DA0)',
                  color: '#fff', letterSpacing: '0.06em', lineHeight: 1.2,
                }}>
                  NOVO
                </span>
              )}
              {link.isOutlet && (
                <span style={{
                  fontSize: 8, fontWeight: 900, padding: '2px 5px', borderRadius: 3,
                  background: 'rgba(34,197,94,0.15)',
                  color: '#22C55E', letterSpacing: '0.06em', lineHeight: 1.2,
                  border: '1px solid rgba(34,197,94,0.25)',
                }}>
                  -40%
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
