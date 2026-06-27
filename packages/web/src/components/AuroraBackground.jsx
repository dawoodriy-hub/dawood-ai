export default function AuroraBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
    }}>
      <div className="aurora-1" style={{
        position: 'absolute', width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)',
        top: '-200px', left: '-150px', filter: 'blur(60px)',
      }} />
      <div className="aurora-2" style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
        top: '20%', right: '-100px', filter: 'blur(80px)',
      }} />
      <div className="aurora-3" style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)',
        bottom: '-100px', left: '30%', filter: 'blur(70px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
    </div>
  );
}
