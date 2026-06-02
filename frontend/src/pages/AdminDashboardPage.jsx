import { useState } from 'react';

export default function AdminDashboard({ onNavigate }) {
  const [showAlert, setShowAlert] = useState(false);

  const alerts = [
    { id: 1, type: 'security', icon: '🔒', title: 'Security Alert', msg: 'Failed login attempts detected', severity: 'high' },
    { id: 2, type: 'update', icon: '⚙️', title: 'System Update', msg: 'New version available for deployment', severity: 'medium' },
    { id: 3, type: 'account', icon: '👤', title: 'New User', msg: '5 new teacher accounts created', severity: 'low' },
    { id: 4, type: 'system', icon: '⚠️', title: 'Database', msg: '92% storage capacity used', severity: 'medium' },
  ];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.1 }}>Admin Dashboard 👑</h1>
          <p style={{ fontSize: 14, color: 'var(--text-mid)', marginTop: 2 }}>System Control Center · All Systems Operational</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <button 
            onClick={() => setShowAlert(!showAlert)}
            style={{ width: 42, height: 42, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', position: 'relative' }}>
            🚨
            <span style={{ width: 10, height: 10, background: '#E24B4A', borderRadius: '50%', position: 'absolute', top: 6, right: 6, border: '2px solid white' }} />
          </button>

          {/* Alerts Popup */}
          {showAlert && (
            <div style={{
              position: 'absolute', top: 50, right: 0, width: 360, background: 'white', borderRadius: 'var(--radius)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden'
            }}>
              <div style={{ padding: 16, borderBottom: '1px solid #F5EDE6', fontWeight: 700, fontSize: 14, background: '#FFF0E8' }}>System Alerts (4)</div>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {alerts.map(a => (
                  <div key={a.id} style={{ padding: 14, borderBottom: '1px solid #F5EDE6', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', gap: 10 }} onMouseEnter={e => e.currentTarget.style.background = '#FFF6E8'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: 18, width: 30, flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: a.severity === 'high' ? '#E24B4A' : a.severity === 'medium' ? '#FA9058' : '#FECC64', textTransform: 'uppercase' }}>{a.severity} {a.type.toUpperCase()}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginTop: 2 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>{a.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #7B52AB, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'white', boxShadow: '0 4px 12px rgba(123,82,171,0.3)', cursor: 'pointer' }}>AD</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { icon: '👥', value: '145', label: 'User Accounts', sub: '✅ All Active', color: '#5BCC8A' },
          { icon: '👩‍🏫', value: '28', label: 'Teachers', sub: '⬆️ +3 this month', color: '#4285F4' },
          { icon: '👧', value: '450', label: 'Students', sub: '📈 +15 this month', color: '#FA9058' },
          { icon: '🏫', value: '15', label: 'Classes', sub: '✓ All running', color: '#7B52AB' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 22, width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}20` }}>{s.icon}</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.sub}</div>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: s.color, opacity: 0.1 }} />
          </div>
        ))}
      </div>

      {/* System Status + Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* System Status */}
        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 18 }}>⚙️ System Status</div>
          {[
            { label: 'Database', status: 'Online', uptime: '99.9%', color: '#5BCC8A' },
            { label: 'API Server', status: 'Online', uptime: '99.8%', color: '#5BCC8A' },
            { label: 'Email Service', status: 'Online', uptime: '99.9%', color: '#5BCC8A' },
            { label: 'Storage', status: '92% Full', uptime: 'Action Needed', color: '#FA9058' },
            { label: 'Backup', status: 'Last 2h ago', uptime: 'Completed', color: '#5BCC8A' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid #F5EDE6' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>{s.uptime}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: `${s.color}20`, color: s.color }}>{s.status}</span>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 18 }}>⚡ Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '📢', label: 'Post Maintenance', action: 'announcements' },
              { icon: '💬', label: 'Teacher Chat', action: 'chat' },
              { icon: '📊', label: 'View KPIs', action: 'kpi' },
              { icon: '📋', label: 'Attendance', action: 'attendance' },
            ].map(a => (
              <button
                key={a.action}
                onClick={() => onNavigate(a.action)}
                style={{
                  padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--apricot)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, color: 'var(--text-dark)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FCEABC'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--apricot)'}
              >
                <span style={{ fontSize: 16 }}>{a.icon}</span>
                {a.label}
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-mid)' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Teacher KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Security */}
        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 18 }}>🔒 Security Overview</div>
          {[
            { label: 'Failed Login Attempts', value: '3', warn: 'Last 24h', color: '#E24B4A' },
            { label: 'Password Changes', value: '7', warn: 'This week', color: '#5BCC8A' },
            { label: 'Active Sessions', value: '42', warn: 'Right now', color: '#4285F4' },
            { label: 'Security Score', value: '94/100', warn: 'Excellent', color: '#5BCC8A' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid #F5EDE6' : 'none' }}>
              <div style={{ fontSize: 13, color: 'var(--text-dark)', fontWeight: 600 }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{s.warn}</span>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Teacher KPI Summary */}
        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 18 }}>📈 Teacher KPI Summary</div>
          {[
            { teacher: 'Sara Ahmed', role: 'Mathematics', score: 92, trend: '⬆️' },
            { teacher: 'Fahad Al-Dosari', role: 'Arabic', score: 88, trend: '→' },
            { teacher: 'Noor Al-Shammari', role: 'English', score: 95, trend: '⬆️' },
            { teacher: 'Mohammed Al-Ghamdi', role: 'Science', score: 85, trend: '⬇️' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid #F5EDE6' : 'none' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dark)' }}>{t.teacher}</div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 2 }}>{t.role}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: 14, fontWeight: 800, color: t.score >= 90 ? '#5BCC8A' : t.score >= 80 ? '#FA9058' : '#E24B4A' }}>{t.score}%</span>
                <span style={{ fontSize: 14 }}>{t.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
