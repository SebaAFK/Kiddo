import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Mock data
const ADMIN_ANNOUNCEMENTS = [
  { id: 1, title: 'Server Maintenance Scheduled', body: 'Database maintenance scheduled for Sunday 2-4 AM', type: 'maintenance', date: '16/05/2026', status: 'scheduled' },
];

const ADMIN_TEACHERS = [
  { id: 1, name: 'Sara Ahmed', email: 'sara.ahmed@school.sa', status: 'online' },
  { id: 2, name: 'Fahad Al-Dosari', email: 'fahad.dosari@school.sa', status: 'online' },
  { id: 3, name: 'Noor Al-Shammari', email: 'noor.shammari@school.sa', status: 'away' },
];

const ADMIN_CHAT_MESSAGES = {
  1: [
    { id: 1, sender: 'Admin', text: 'Hi Sara, server maintenance scheduled for Sunday.', time: '10:30', isAdmin: true },
    { id: 2, sender: 'Sara Ahmed', text: 'Thank you for the notice! Any impact on data?', time: '10:35', isAdmin: false },
    { id: 3, sender: 'Admin', text: 'No impact. Just infrastructure updates. 2-4 AM window.', time: '10:36', isAdmin: true },
  ],
};

// ─── ANNOUNCEMENTS ───
export function AdminAnnouncementsPage() {
  const { token } = useAuth();

  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', badge_type: 'Info', target_grade: '' });
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState('');

  const BASE = 'http://localhost:5001/api';

  const load = () => {
    setLoading(true);
    fetch(`${BASE}/announcements`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setAnns(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setAnns([]); setLoading(false); });
  };

  useEffect(() => { if (token) load(); }, [token]);

  const post = async () => {
    if (!form.title.trim()) { setMsg('Please enter a title.'); return; }
    setPosting(true); setMsg('');
    try {
      const res = await fetch(`${BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: form.title, description: form.description, badge_type: form.badge_type, target_grade: form.target_grade || null }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('✅ Announcement posted! Students and teachers will see it.');
        setForm({ title: '', description: '', badge_type: 'Info', target_grade: '' });
        setShowForm(false);
        load();
      } else { setMsg(data.error || 'Failed.'); }
    } catch { setMsg('Cannot connect to server.'); }
    setPosting(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    await fetch(`${BASE}/announcements/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>📢 Announcements</h2>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Post announcements to all or specific grades</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(p => !p)}>＋ New Announcement</button>
      </div>

      {msg && <div style={{ padding: '10px 14px', borderRadius: 10, background: msg.startsWith('✅') ? '#E8FBF0' : '#FFF0E8', color: msg.startsWith('✅') ? '#34A853' : '#FA9058', fontSize: 13, fontWeight: 600 }}>{msg}</div>}

      {showForm && (
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, border: '2px solid var(--orange)', boxShadow: '0 4px 16px rgba(250,144,88,0.2)' }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>✍️ New Announcement</div>
          <input className="form-input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="Title…" />
          <textarea className="form-input" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Description (optional)…" style={{ minHeight: 100, fontFamily: 'Nunito, sans-serif', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="form-select" value={form.badge_type} onChange={e => setForm(f=>({...f,badge_type:e.target.value}))}>
              {['Info','Urgent','Event','New','Academic','Homework'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="form-select" value={form.target_grade} onChange={e => setForm(f=>({...f,target_grade:e.target.value}))}>
              <option value="">📢 All Grades</option>
              <option value="1">Grade 1 only</option>
              <option value="2">Grade 2 only</option>
              <option value="3">Grade 3 only</option>
            </select>
            <button className="btn-primary" onClick={post} disabled={posting}>{posting ? 'Posting...' : 'Post ✅'}</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p style={{ color: 'var(--text-light)', fontSize: 13 }}>Loading...</p> :
       anns.length === 0 ? <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 40 }}>No announcements yet.</p> :
       <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {anns.map(a => (
          <div key={a.announcement_id} className="card" style={{ borderLeft: `4px solid #FA9058` }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 700, color: 'var(--text-dark)' }}>{a.title}</div>
                {a.description && <div style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.5 }}>{a.description}</div>}
                <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 11, color: 'var(--text-light)' }}>
                  <span>📅 {new Date(a.date_posted).toLocaleDateString()}</span>
                  <span>👤 {a.author}</span>
                  <span>🎯 {a.target_grade ? `Grade ${a.target_grade}` : 'All Grades'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: '#FFF0E8', color: '#FA9058' }}>{a.badge_type}</span>
                <button onClick={() => del(a.announcement_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#ccc' }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
       </div>}
    </div>
  );
}

export function AdminChatPage() {
  const [selectedTeacher, setSelectedTeacher] = useState(1);
  const [messages, setMessages] = useState(ADMIN_CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' }); }, [selectedTeacher, messages]);

  const send = () => {
    if (!input.trim() || !selectedTeacher) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    setMessages(prev => ({
      ...prev,
      [selectedTeacher]: [...(prev[selectedTeacher] || []), { id: Date.now(), sender: 'Admin', text: input, time, isAdmin: true }]
    }));
    setInput('');
  };

  const teacher = ADMIN_TEACHERS.find(t => t.id === selectedTeacher);
  const currentMessages = messages[selectedTeacher] || [];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>💬 Teacher Communication</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, height: 'calc(100vh - 250px)' }}>
        {/* Teachers list */}
        <div className="card" style={{ overflowY: 'auto', padding: 0 }}>
          {ADMIN_TEACHERS.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTeacher(t.id)}
              style={{
                width: '100%', padding: 14, borderBottom: '1px solid #F5EDE6', background: selectedTeacher === t.id ? '#FFF0E8' : 'white',
                border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.status === 'online' ? '#5BCC8A' : '#FECC64' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-light)' }}>{t.status}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-dark)', paddingBottom: 12, borderBottom: '1px solid #F5EDE6' }}>👩‍🏫 {teacher?.name}</div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
            {currentMessages.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.isAdmin ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 2 }}>{m.sender}</div>
                <div className={m.isAdmin ? 'bubble-text-out' : 'bubble-text-in'}>{m.text}</div>
                <div style={{ fontSize: 9, color: 'var(--text-light)', marginTop: 2 }}>{m.time}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid #F5EDE6' }}>
            <input className="form-input" style={{ flex: 1, margin: 0, borderRadius: 30 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type message…" />
            <button onClick={send} style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), #f97040)', border: 'none', color: 'white', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ATTENDANCE ───
export function AdminAttendancePage() {
  const [selectedTeacher, setSelectedTeacher] = useState('Sara Ahmed');
  const [month, setMonth] = useState('May');

  const attendanceData = {
    'Sara Ahmed': { present: 18, absent: 1, late: 1, total: 20 },
    'Fahad Al-Dosari': { present: 19, absent: 0, late: 1, total: 20 },
    'Noor Al-Shammari': { present: 20, absent: 0, late: 0, total: 20 },
    'Mohammed Al-Ghamdi': { present: 17, absent: 2, late: 1, total: 20 },
  };

  const data = attendanceData[selectedTeacher];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>📋 Teacher Attendance</h2><p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Track teacher attendance records</p></div>

      <div className="card">
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <select className="form-select" value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}>
            {Object.keys(attendanceData).map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="form-select" value={month} onChange={e => setMonth(e.target.value)}>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Present', value: data.present, color: '#5BCC8A', bg: '#E8FBF0' },
            { label: 'Absent', value: data.absent, color: '#E24B4A', bg: '#FFF0E8' },
            { label: 'Late', value: data.late, color: '#FA9058', bg: '#FFF0E8' },
            { label: 'Total', value: data.total, color: '#4285F4', bg: '#E8F4FF' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-mid)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #F5EDE6', paddingTop: 16 }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Attendance Rate: <span style={{ color: '#5BCC8A' }}>{Math.round((data.present / data.total) * 100)}%</span></div>
          <div style={{ width: '100%', height: 20, borderRadius: 10, background: '#F5EDE6', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(data.present / data.total) * 100}%`, background: 'linear-gradient(90deg, #5BCC8A, #34A853)', borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI ───
export function AdminKPIPage() {
  const kpiData = [
    { name: 'Sara Ahmed', lessons: 88, rating: 4.8, students: 90, satisfaction: 95, trend: '⬆️' },
    { name: 'Fahad Al-Dosari', lessons: 92, rating: 4.6, students: 85, satisfaction: 92, trend: '→' },
    { name: 'Noor Al-Shammari', lessons: 95, rating: 4.9, students: 95, satisfaction: 98, trend: '⬆️' },
    { name: 'Mohammed Al-Ghamdi', lessons: 82, rating: 4.4, students: 80, satisfaction: 88, trend: '⬇️' },
  ];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>📊 Teacher KPI</h2><p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Performance metrics and ratings</p></div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="kiddo-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Lessons</th>
              <th>Rating</th>
              <th>Students</th>
              <th>Satisfaction</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {kpiData.map((t, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{t.name}</td>
                <td>{t.lessons}%</td>
                <td><span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#FA9058' }}>{t.rating}</span>/5</td>
                <td>{t.students}</td>
                <td><span style={{ fontWeight: 800, color: t.satisfaction >= 95 ? '#5BCC8A' : '#FA9058' }}>{t.satisfaction}%</span></td>
                <td style={{ fontSize: 16 }}>{t.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🏆 Top Performers</div>
          {kpiData.sort((a, b) => b.rating - a.rating).slice(0, 3).map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 2 ? '1px solid #F5EDE6' : 'none' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FA9058', width: 24 }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{t.satisfaction}% student satisfaction</div>
              </div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 15, fontWeight: 800, color: '#5BCC8A' }}>{t.rating}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚡ Action Items</div>
          {[
            "Mohammed's satisfaction below target (88%)",
            'Schedule performance review for Q2',
            'Recognize Noor Al-Shammari excellence',
            'Plan professional development for all'
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid #F5EDE6' : 'none', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 14, marginTop: 2 }}>→</div>
              <div style={{ fontSize: 12, color: 'var(--text-mid)', flex: 1 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
