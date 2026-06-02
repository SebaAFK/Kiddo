import { useState } from 'react';

export default function Dashboard({ onNavigate }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const today = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} · Academic Year 2025–2026`;

  const notifications = [
    { id: 1, text: 'Math Quiz — Grades submitted', time: '2 hours ago', type: 'grades' },
    { id: 2, text: 'New message from parents group', time: '1 hour ago', type: 'message' },
    { id: 3, text: 'Schedule: Open Day tomorrow at 10 AM', time: '24 hours ago', type: 'schedule' },
  ];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.1 }}>Good morning, Sara! 👋</h1>
          <p style={{ fontSize: 14, color: 'var(--text-mid)', marginTop: 2 }}>{dateStr}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ width: 42, height: 42, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', position: 'relative' }}>
            🔔
            <span style={{ width: 9, height: 9, background: 'var(--orange)', borderRadius: '50%', position: 'absolute', top: 8, right: 8, border: '2px solid white' }} />
          </button>

          {/* Notifications Popup */}
          {showNotifications && (
            <div style={{
              position: 'absolute', top: 50, right: 0, width: 340, background: 'white', borderRadius: 'var(--radius)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden'
            }}>
              <div style={{ padding: 16, borderBottom: '1px solid #F5EDE6', fontWeight: 700, fontSize: 14 }}>Notifications (3)</div>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: 14, borderBottom: '1px solid #F5EDE6', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', gap: 10 }} onMouseEnter={e => e.currentTarget.style.background = '#FFF6E8'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), var(--yellow))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'white', boxShadow: '0 4px 12px rgba(250,144,88,0.3)', cursor: 'pointer' }}>SA</div>
        </div>
      </div>

      {/* Banner */}
      <div className="today-banner">
        <div>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 22, fontWeight: 800, color: 'white' }}>4 classes today</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>Next up: Mathematics — Grade 4A at 08:30 · Room 101</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {['🔢 Math 4A', '🔢 Math 4B', '🔬 Science 5A', '🔬 Science 5B'].map(p => (
              <span key={p} style={{ background: 'rgba(255,255,255,0.28)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { icon: '📨', value: '3',  label: 'Messages',       sub: 'From parents today',   bg: '#FFF0E8', pseudo: 'var(--orange)' },
          { icon: '📚', value: '4',  label: 'Classes Today',  sub: '90 students total',     bg: 'var(--azure)', pseudo: 'var(--apogyan)' },
          { icon: '📝', value: '7',  label: 'Pending Reviews',sub: 'Assignments to grade',  bg: '#FFFBE8', pseudo: 'var(--yellow)' },
          { icon: '👥', value: '5',  label: 'Activities',     sub: 'This week',             bg: '#E8FBF0', pseudo: '#5BCC8A' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <style>{`.stat-icon-${s.label.replace(/\s/g,'')}::before { background: ${s.pseudo}; }`}</style>
            <div style={{ fontSize: 22, width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg }}>{s.icon}</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.sub}</div>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: s.pseudo, opacity: 0.12 }} />
          </div>
        ))}
      </div>

      {/* Grid: Schedule + Announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* Today's schedule */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, color: 'var(--text-dark)' }}>📅 Today's Schedule</div>
            <button className="btn-ghost" onClick={() => onNavigate('schedule')}>Full Schedule →</button>
          </div>
          {[
            { time: '08:30–09:15', subj: '🔢 Mathematics', detail: 'Grade 4A · 22 students', room: 'R-101', color: '#FA9058' },
            { time: '10:00–10:45', subj: '🔢 Mathematics', detail: 'Grade 4B · 20 students', room: 'R-101', color: '#FA9058' },
            { time: '11:30–12:15', subj: '🔬 Science',     detail: 'Grade 5A · 25 students', room: 'Lab-2', color: '#5BCC8A' },
            { time: '14:00–17:00', subj: '🚌 School Trip — Science Museum', detail: 'All Grades', room: 'Trip', color: '#7B52AB' },
          ].map((p, i) => (
            <div key={i} className="period">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-light)', width: 75, flexShrink: 0 }}>{p.time}</div>
              <div style={{ width: 4, height: 36, borderRadius: 4, background: p.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{p.subj}</div>
                <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{p.detail}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: 'var(--apricot)', color: 'var(--text-mid)' }}>{p.room}</div>
            </div>
          ))}
        </div>

        {/* Announcements */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, color: 'var(--text-dark)' }}>📢 Announcements</div>
            <button className="btn-ghost" onClick={() => onNavigate('announcements')}>All →</button>
          </div>
          {[
            { dot: '#FA9058', title: 'Math Quiz — Monday 5th',    desc: "Chapters 7 & 8. Remind Grade 4A students.", meta: 'Today · Grade 4A',   badge: 'Urgent', badgeBg: '#FFF0E8', badgeColor: '#FA9058' },
            { dot: '#95CAFC', title: 'Open Day — Thursday 8th',   desc: 'Parents invited 10AM–2PM.', meta: '2 days ago · All Grades', badge: 'Event', badgeBg: '#E8F4FF', badgeColor: '#4285F4' },
            { dot: '#FECC64', title: '🎉 Eid Celebration',        desc: 'Students wear traditional attire.', meta: '3 days ago · All',     badge: 'Event', badgeBg: '#FFFBE8', badgeColor: '#C9960A' },
          ].map((a, i) => (
            <div key={i} className="ann-row">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.dot, marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.4 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>📌 {a.meta}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: a.badgeBg, color: a.badgeColor, flexShrink: 0 }}>{a.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Classes + Attendance + Messages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 20 }}>
        {/* Classes */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700 }}>📚 My Classes</div>
            <button className="btn-ghost" onClick={() => onNavigate('classes')}>Details →</button>
          </div>
          {[
            { ico: '🔢', bg: '#FFF0E8', name: 'Grade 4A — Mathematics', sub: '22 students · 08:30 AM · R-101', grade: '88%', gc: '#FA9058', gBg: '#FFF0E8' },
            { ico: '🔢', bg: '#FFF0E8', name: 'Grade 4B — Mathematics', sub: '20 students · 10:00 AM · R-101', grade: '84%', gc: '#FA9058', gBg: '#FFF0E8' },
            { ico: '🔬', bg: '#E8FBF0', name: 'Grade 5A — Science',     sub: '25 students · 11:30 AM · Lab-2', grade: '91%', gc: '#5BCC8A', gBg: '#E8FBF0' },
            { ico: '🔬', bg: '#E8FBF0', name: 'Grade 5B — Science',     sub: '23 students · 01:00 PM · Lab-2', grade: '87%', gc: '#5BCC8A', gBg: '#E8FBF0' },
          ].map((c, i) => (
            <div key={i} className="item-row">
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.ico}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{c.sub}</div>
              </div>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: 14, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: c.gBg, color: c.gc }}>{c.grade}</span>
            </div>
          ))}
        </div>

        {/* Attendance ring */}
        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, marginBottom: 18 }}>✅ Class Attendance</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
            <div className="ring">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F0E8E0" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#5BCC8A" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="15" strokeLinecap="round" />
              </svg>
              <div className="ring-center">
                <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>94%</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-light)' }}>Present</div>
              </div>
            </div>
            <div>
              {[['#5BCC8A','Present','85'],['#FA9058','Absent','4'],['#FECC64','Late','1']].map(([dot,lbl,val]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: 'var(--text-mid)', flex: 1 }}>{lbl}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dark)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-light)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>Today's Classes</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
            {[['4A','done'],['4B','done'],['5A','pending'],['5B','pending']].map(([cls,status]) => (
              <div key={cls} style={{ opacity: status === 'pending' ? 0.35 : 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: status === 'done' ? '#5BCC8A' : '#F0E8E0', color: status === 'done' ? 'white' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, margin: '0 auto 4px' }}>{status === 'done' ? '✓' : '–'}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-mid)', textAlign: 'center' }}>{cls}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent messages */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700 }}>👨‍👩‍👧 Parent Messages</div>
            <button className="btn-ghost" onClick={() => onNavigate('parents')}>Open →</button>
          </div>
          {[
            { init: 'AD', bg: '#FFF0E8', ic: '#FA9058', name: "Ahmed's Dad",  msg: 'Is there a study guide for the quiz?', time: '09:25' },
            { init: 'NM', bg: '#E8F4FF', ic: '#4285F4', name: "Nora's Mom",   msg: 'Will the quiz cover chapters 5 & 6?', time: '09:31' },
            { init: 'KD', bg: '#E8FBF0', ic: '#5BCC8A', name: "Khalid's Dad", msg: 'Form submitted! Excited for the trip.', time: '08:45' },
          ].map((m, i) => (
            <div key={i} className="item-row">
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: m.ic, flexShrink: 0 }}>{m.init}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{m.msg}</div>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-light)', whiteSpace: 'nowrap' }}>{m.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
