export default function Navbar({ onSignIn }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: 64,
      background: 'rgba(5,10,20,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,212,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff',
          fontFamily: 'var(--font-mono)',
        }}>D</div>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
          background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Dawood AI</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {['Features', 'Docs', 'GitHub'].map(l => (
          <a
            key={l}
            href={l === 'GitHub' ? 'https://github.com/dawoodriy-hub/dawood-ai' : '#'}
            target={l === 'GitHub' ? '_blank' : undefined}
            rel={l === 'GitHub' ? 'noreferrer' : undefined}
            style={{
              color: '#64748b', textDecoration: 'none', fontSize: 14,
              fontWeight: 500, letterSpacing: '0.02em', transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
          >{l}</a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onSignIn}
          style={{
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            border: '1px solid rgba(0,212,255,0.3)', background: 'transparent',
            color: '#00d4ff', fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-ui)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >Log in</button>
        <button
          onClick={onSignIn}
          style={{
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            border: 'none',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            color: '#fff', fontSize: 14, fontWeight: 700,
            fontFamily: 'var(--font-ui)', transition: 'all 0.2s',
            boxShadow: '0 4px 20px rgba(0,212,255,0.25)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,212,255,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,212,255,0.25)'; }}
        >Sign up free</button>
      </div>
    </nav>
  );
}
