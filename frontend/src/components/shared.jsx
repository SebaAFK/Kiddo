// ─────────────────────────────────────────────────────────────
// components/shared/KiddoLogo.jsx
// ─────────────────────────────────────────────────────────────
export function KiddoLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
        <rect x="8" y="6" width="16" height="36" rx="3" fill="#FECC64" />
        <rect x="8" y="6" width="16" height="8" rx="3" fill="#E8453C" />
        <rect x="6" y="6" width="20" height="3" rx="1.5" fill="#FFC0C0" />
        <path d="M8 42 L16 52 L24 42 Z" fill="#FA9058" />
        <rect x="12" y="10" width="8" height="32" rx="2" fill="#FFD97A" />
        <rect x="14" y="6" width="4" height="8" fill="#C0392B" />
      </svg>
      <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
        <span style={{ color: '#E8453C' }}>K</span>
        <span style={{ color: '#FECC64' }}>i</span>
        <span style={{ color: '#34A853' }}>d</span>
        <span style={{ color: '#4285F4' }}>d</span>
        <span style={{ color: '#7B52AB' }}>o</span>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// components/shared/BgIcons.jsx
// ─────────────────────────────────────────────────────────────
export function BgIcons() {
  const items = [
    { icon: '❤', top: '5%',  left: '8%',  delay: '0s',   dur: '7s',  color: '#FA9058' },
    { icon: '★', top: '12%', left: '26%', delay: '1s',   dur: '9s',  color: '#FECC64' },
    { icon: '🚗',top: '7%',  left: '46%', delay: '2s',   dur: '8s',  color: '#95CAFC' },
    { icon: '❤', top: '18%', left: '68%', delay: '0.5s', dur: '10s', color: '#FA9058' },
    { icon: '★', top: '6%',  left: '84%', delay: '3s',   dur: '7s',  color: '#FECC64' },
    { icon: '🚗',top: '32%', left: '92%', delay: '1.5s', dur: '9s',  color: '#95CAFC' },
    { icon: '★', top: '38%', left: '4%',  delay: '4s',   dur: '8s',  color: '#FECC64' },
    { icon: '🚗',top: '52%', left: '18%', delay: '2.5s', dur: '7s',  color: '#95CAFC' },
    { icon: '❤', top: '58%', left: '38%', delay: '0s',   dur: '11s', color: '#FA9058' },
    { icon: '★', top: '45%', left: '58%', delay: '3.5s', dur: '8s',  color: '#FECC64' },
    { icon: '❤', top: '65%', left: '75%', delay: '1s',   dur: '9s',  color: '#FA9058' },
    { icon: '🚗',top: '72%', left: '8%',  delay: '2s',   dur: '10s', color: '#95CAFC' },
    { icon: '★', top: '80%', left: '28%', delay: '0.5s', dur: '8s',  color: '#FECC64' },
    { icon: '❤', top: '75%', left: '50%', delay: '3s',   dur: '9s',  color: '#FA9058' },
    { icon: '🚗',top: '85%', left: '72%', delay: '1.5s', dur: '7s',  color: '#95CAFC' },
    { icon: '★', top: '90%', left: '90%', delay: '4s',   dur: '11s', color: '#FECC64' },
    { icon: '❤', top: '25%', left: '52%', delay: '2s',   dur: '9s',  color: '#FA9058' },
    { icon: '★', top: '60%', left: '88%', delay: '3.5s', dur: '8s',  color: '#FECC64' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {items.map((x, i) => (
        <span key={i} style={{
          position: 'absolute', top: x.top, left: x.left,
          opacity: 0.055, fontSize: x.icon === '🚗' ? 20 : 24,
          color: x.color, userSelect: 'none',
          animation: `kiddoFloat ${x.dur} ease-in-out ${x.delay} infinite`,
        }}>{x.icon}</span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// components/shared/StatCard.jsx
// ─────────────────────────────────────────────────────────────
export function StatCard({ icon, value, label, sub, variant }) {
  const variants = {
    orange: { bg: '#FFF0E8', pseudo: '#FA9058' },
    yellow: { bg: '#FFFBE8', pseudo: '#FECC64' },
    blue:   { bg: 'var(--azure)', pseudo: 'var(--apogyan)' },
    green:  { bg: '#E8FBF0', pseudo: '#5BCC8A' },
  };
  const v = variants[variant] || variants.orange;
  return (
    <div className={`stat-card`} style={{ '--pseudo-bg': v.pseudo }}>
      <style>{`.stat-card[style*="${v.pseudo}"]::before { background: ${v.pseudo}; }`}</style>
      <div style={{ fontSize: 22, width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.bg }}>{icon}</div>
      <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// components/shared/LogoutModal.jsx
// ─────────────────────────────────────────────────────────────
export function LogoutModal({ teacher, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>⏻</div>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 }}>Log out</div>
        <div style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 22, lineHeight: 1.5 }}>
          Are you sure you want to log out, <strong>{teacher.firstName} {teacher.lastName}</strong>?
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-cancel" style={{ flex: 1 }} onClick={onClose}>No, stay</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 11, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--red)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
}
