import { useEffect, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Loader2, LogOut, User } from 'lucide-react';
import { api, type ApiUser } from '../../lib/api';
import { useStore } from '../../store/useStore';

interface Props {
  compact?: boolean;
  onAuthSuccess?: () => void;
}

type Mode = 'login' | 'register';

const fieldStyle: CSSProperties = {
  width: '100%',
  background: '#0d0d0f',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 12,
  padding: '13px 14px',
  color: '#fff',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function AccountPanel({ compact = false, onAuthSuccess }: Props) {
  const { showToast } = useStore();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(() => !!localStorage.getItem('zayeh_token'));
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('zayeh_token');

    if (!token) return;

    api.auth.me()
      .then(user => {
        if (active) setCurrentUser(user);
      })
      .catch(() => {
        localStorage.removeItem('zayeh_token');
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError('');
  };

  const handleAuthenticated = (token: string, user: ApiUser, message: string) => {
    localStorage.setItem('zayeh_token', token);
    setCurrentUser(user);
    resetForm();
    showToast(message);
    onAuthSuccess?.();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    if (mode === 'register') {
      if (!trimmedName) {
        setError('Preencha seu nome.');
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { token, user } = await api.auth.login(trimmedEmail, password);
        handleAuthenticated(token, user, 'Login realizado com sucesso!');
        return;
      }

      const { token, user } = await api.auth.register(trimmedName, trimmedEmail, password);
      handleAuthenticated(token, user, 'Conta criada com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível continuar.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zayeh_token');
    setCurrentUser(null);
    resetForm();
    setMode('login');
    showToast('Sessão encerrada.');
  };

  const containerStyle: CSSProperties = compact
    ? { padding: 0 }
    : { maxWidth: 480, margin: '0 auto', padding: '32px 16px 100px' };

  const cardPadding = compact ? '24px 22px' : '28px 24px';

  return (
    <div style={containerStyle}>
      {!compact && (
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#d8a84a', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
            Minha
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>Conta</h1>
        </div>
      )}

      <div style={{ background: '#111', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', padding: cardPadding, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(216,168,74,0.1)', border: '1px solid rgba(216,168,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <User size={24} style={{ color: '#d8a84a' }} />
        </div>

        {checkingSession ? (
          <div style={{ display: 'grid', placeItems: 'center', gap: 12, padding: '18px 0 10px' }}>
            <Loader2 size={22} style={{ color: '#d8a84a', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: 13, color: '#8b8b8b' }}>Verificando sua conta...</p>
          </div>
        ) : currentUser ? (
          <>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              Ola, {currentUser.name.split(' ')[0]}!
            </p>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 22 }}>
              Conectado com {currentUser.email}
            </p>
            <button
              onClick={handleLogout}
              style={{ width: '100%', padding: '13px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <LogOut size={15} />
              Sair da conta
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
            </p>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
              {mode === 'login'
                ? 'Acompanhe seus pedidos e finalize mais rapido.'
                : 'Cadastre-se para comprar com mais praticidade.'}
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 18, padding: 4, background: '#0d0d0d', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: mode === 'login' ? 'linear-gradient(135deg,#d8a84a,#b8842c)' : 'transparent',
                  color: mode === 'login' ? '#fff' : '#9a9a9a',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: mode === 'register' ? 'linear-gradient(135deg,#d8a84a,#b8842c)' : 'transparent',
                  color: mode === 'register' ? '#fff' : '#9a9a9a',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Criar conta
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8d8d8d', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Nome
                  </label>
                  <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="Seu nome completo"
                    style={fieldStyle}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8d8d8d', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="voce@email.com"
                  style={fieldStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8d8d8d', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Minimo de 6 caracteres"
                  style={fieldStyle}
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8d8d8d', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    placeholder="Repita a senha"
                    style={fieldStyle}
                  />
                </div>
              )}

              {error && (
                <div style={{ padding: '11px 12px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171', fontSize: 12, fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '13px', marginTop: 4, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#d8a84a,#b8842c)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.75 : 1 }}
              >
                {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
                {mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
