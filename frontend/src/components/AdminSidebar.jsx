import { KiddoLogo } from './shared.jsx';

const NAV_SECTIONS = [
  {
    label: 'DASHBOARD',
    items: [
      { id: 'dashboard', label: 'Overview', icon: '📊' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { id: 'announcements', label: 'Maintenance', icon: '📢' },
      { id: 'chat', label: 'Teacher Chat', icon: '💬' },
      { id: 'attendance', label: 'Attendance', icon: '📋' },
      { id: 'kpi', label: 'Teacher KPI', icon: '📈' },
    ],
  },
];

export default function AdminSidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside style={{
      width: 'var(--sidebar-w)', minHeight: '100vh',
      background: 'linear-gradient(135deg, #7B52AB, #A855F7)', display: 'flex', flexDirection: 'column',
      padding: '24px 0', boxShadow: '4px 0 20px rgba(123,82,171,0.2)',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.95 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#7B52AB' }}>👑</div>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 18, fontWeight: 800, color: 'white' }}>Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '20px 12px', flex: 1, overflowY: 'auto' }}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', padding: '0 8px', margin: '18px 0 8px' }}>
              {section.label}
            </div>
            {section.items.map(item => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: 14, fontWeight: 600, marginBottom: 2, userSelect: 'none',
                  background: activePage === item.id ? 'rgba(255,255,255,0.25)' : 'transparent',
                  color: 'white',
                  boxShadow: activePage === item.id ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {item.icon}
                </div>
                {item.label}
              </div>
            ))}
          </div>
        ))}

        {/* Logout */}
        <div
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            color: '#FFB3B3', marginTop: 8, userSelect: 'none',
          }}
        >
          <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⏻</div>
          Log out
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13, color: 'white', flexShrink: 0, border: '2px solid rgba(255,255,255,0.5)'
        }}>
          AD
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Admin</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>System Control</div>
        </div>
      </div>
    </aside>
  );
}
