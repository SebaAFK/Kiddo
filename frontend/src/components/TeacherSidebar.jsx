import { KiddoLogo } from './shared.jsx';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard',      label: 'Dashboard',       icon: '🏠' },
      { id: 'announcements',  label: 'Announcements',   icon: '📢', badge: 3 },
    ],
  },
  {
    label: 'Teaching',
    items: [
      { id: 'classes',  label: 'My Classes', icon: '📚' },
      { id: 'schedule', label: 'Schedule',   icon: '📅' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { id: 'parents', label: 'Parents Groups', icon: '👨‍👩‍👧', badge: 2 },
    ],
  },
  {
    label: 'Admin',
    items: [
      { id: 'adminmessages', label: 'Admin Messages', icon: '💬' },
      { id: 'mykpi',         label: 'My Performance', icon: '🏆' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile', label: 'My Profile', icon: '👤' },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate, teacher, onLogout }) {
  return (
    <aside style={{
      width: 'var(--sidebar-w)', minHeight: '100vh',
      background: 'var(--white)', display: 'flex', flexDirection: 'column',
      padding: '24px 0', boxShadow: '4px 0 20px rgba(250,144,88,0.08)',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '2px dashed var(--sun)' }}>
        <KiddoLogo />
      </div>

      {/* Nav */}
      <nav style={{ padding: '20px 12px', flex: 1, overflowY: 'auto' }}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-light)', padding: '0 8px', margin: '18px 0 8px' }}>
              {section.label}
            </div>
            {section.items.map(item => (
              <div
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: 14, fontWeight: 600, marginBottom: 2, userSelect: 'none',
                  background: activePage === item.id ? 'linear-gradient(135deg, var(--orange), #f97040)' : 'transparent',
                  color: activePage === item.id ? 'white' : 'var(--text-mid)',
                  boxShadow: activePage === item.id ? '0 4px 14px rgba(250,144,88,0.35)' : 'none',
                }}
              >
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {item.icon}
                </div>
                {item.label}
                {item.badge && (
                  <span style={{
                    marginLeft: 'auto',
                    background: activePage === item.id ? 'rgba(255,255,255,0.3)' : 'var(--yellow)',
                    color: activePage === item.id ? 'white' : 'var(--text-dark)',
                    fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 20,
                  }}>
                    {item.badge}
                  </span>
                )}
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
            color: 'var(--red)', marginTop: 8, userSelect: 'none',
          }}
        >
          <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⏻</div>
          Log out
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '2px dashed var(--sun)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--orange), var(--yellow))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13, color: 'white', flexShrink: 0,
        }}>
          {teacher.initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{teacher.firstName} {teacher.lastName.split(' ')[0]}</div>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Teacher · Grade 4 & 5</div>
        </div>
      </div>
    </aside>
  );
}