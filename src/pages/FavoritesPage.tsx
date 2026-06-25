import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '40px 24px 100px', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(184,132,44,0.08)', border: '1px solid rgba(184,132,44,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Heart size={30} style={{ color: '#b8842c' }} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Nenhum favorito ainda</h2>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 28, maxWidth: 280, lineHeight: 1.6 }}>
        Salve os produtos que você curtiu para comprar depois com mais facilidade.
      </p>
      <Link to="/categoria/todos" className="btn-gradient no-underline" style={{ padding: '12px 28px', borderRadius: 10, fontSize: 13 }}>
        Explorar produtos
      </Link>
    </div>
  );
}
