import { useState, useRef, useEffect } from 'react';
import { SCHEDULE, PARENT_GROUPS, INITIAL_MESSAGES } from '../data/mockData.js';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// ─────────────────────────────────────────────────────────────
// ANNOUNCEMENTS PAGE — connected to real DB
// ─────────────────────────────────────────────────────────────
export function AnnouncementsPage() {
  const { token } = useAuth();
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', badge_type: 'Info', target_grade: '' });
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState('');

  const tagMeta = {
    Academic: { color: '#FA9058', bg: '#FFF0E8' },
    Event:    { color: '#4285F4', bg: '#E8F4FF' },
    Urgent:   { color: '#E24B4A', bg: '#FFF0E8' },
    Info:     { color: '#95CAFC', bg: '#E8F4FF' },
    Homework: { color: '#C9960A', bg: '#FFFBE8' },
    New:      { color: '#5BCC8A', bg: '#E8FBF0' },
  };

  const load = () => {
    setLoading(true);
    apiFetch('/announcements', token)
      .then(data => { setAnns(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setAnns([]); setLoading(false); });
  };

  useEffect(() => { load(); }, [token]);

  const post = async () => {
    if (!form.title.trim()) { setMsg('Please enter a title.'); return; }
    setPosting(true); setMsg('');
    try {
      const res = await apiFetch('/announcements', token, {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          badge_type: form.badge_type,
          target_grade: form.target_grade || null,
        }),
      });
      if (res.success) {
        setMsg('✅ Announcement posted!');
        setForm({ title: '', description: '', badge_type: 'Info', target_grade: '' });
        setShowForm(false);
        load();
      } else {
        setMsg(res.error || 'Failed to post.');
      }
    } catch { setMsg('Cannot connect to server.'); }
    setPosting(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    await apiFetch(`/announcements/${id}`, token, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800, color: 'var(--text-dark)' }}>📢 Announcements</h2>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Post announcements — parents and students will see them</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(p => !p)}>＋ New Announcement</button>
      </div>

      {msg && <div style={{ padding: '10px 14px', borderRadius: 10, background: msg.startsWith('✅') ? '#E8FBF0' : '#FFF0E8', color: msg.startsWith('✅') ? '#34A853' : '#FA9058', fontSize: 13, fontWeight: 600 }}>{msg}</div>}

      {showForm && (
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, border: '2px solid var(--yellow)', boxShadow: '0 4px 16px rgba(254,204,100,0.2)' }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>✍️ New Announcement</div>
          <input className="form-input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="Title (e.g. Math Quiz this Friday)" />
          <textarea className="form-input" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Description (optional)…" style={{ minHeight: 80, fontFamily: 'Nunito, sans-serif', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select className="form-select" value={form.badge_type} onChange={e => setForm(f=>({...f,badge_type:e.target.value}))}>
              {Object.keys(tagMeta).map(t => <option key={t}>{t}</option>)}
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

      {loading ? <p style={{ color: 'var(--text-light)', fontSize: 13 }}>Loading announcements...</p> :
       anns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)', fontSize: 14 }}>No announcements yet. Post your first one above!</div>
       ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {anns.map(a => {
            const tm = tagMeta[a.badge_type] || tagMeta.Info;
            const isExp = expanded === a.announcement_id;
            return (
              <div key={a.announcement_id} style={{ background: 'white', borderRadius: 'var(--radius-sm)', border: `1.5px solid #F5EDE6`, borderLeft: `4px solid ${tm.color}`, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setExpanded(p => p===a.announcement_id?null:a.announcement_id)}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: tm.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-dark)' }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                      {a.author} · {new Date(a.date_posted).toLocaleDateString()} {a.target_grade ? `· Grade ${a.target_grade}` : '· All Grades'}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: tm.bg, color: tm.color }}>{a.badge_type}</span>
                  <button onClick={e=>{e.stopPropagation();del(a.announcement_id);}} style={{ background:'none',border:'none',cursor:'pointer',fontSize:14,color:'#ccc',padding:'0 4px' }}>🗑</button>
                  <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{isExp ? '▲' : '▼'}</span>
                </div>
                {isExp && (
                  <div style={{ padding: '0 16px 14px', borderTop: '1px solid #F5EDE6', fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7, paddingTop: 10 }}>
                    {a.description || <em style={{ color: 'var(--text-light)' }}>No description provided.</em>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ClassesPage() {
  const { token } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openClass, setOpenClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studLoading, setStudLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'attendance'
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch('/teacher/classes', token)
      .then(data => { setClasses(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setClasses([]); setLoading(false); });
  }, [token]);

  const openClassDetail = async (cls) => {
    setOpenClass(cls);
    setStudLoading(true);
    setActiveTab('students');
    try {
      const data = await apiFetch(`/teacher/students/${cls.class_number}/grades`, token);
      setStudents(Array.isArray(data) ? data : []);
    } catch { setStudents([]); }
    setStudLoading(false);
  };

  const loadAttendance = async () => {
    setStudLoading(true);
    setActiveTab('attendance');
    try {
      const data = await apiFetch(`/teacher/students/${openClass.class_number}/attendance`, token);
      const map = {};
      data.forEach(s => { map[s.username] = s.today_status || 'present'; });
      setAttendance(map);
      setStudents(Array.isArray(data) ? data : []);
    } catch {}
    setStudLoading(false);
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      for (const [username, status] of Object.entries(attendance)) {
        await apiFetch('/teacher/attendance', token, {
          method: 'POST',
          body: JSON.stringify({ student_username: username, status }),
        });
      }
      alert('Attendance saved! ✅');
    } catch { alert('Error saving attendance.'); }
    setSaving(false);
  };

  const gradeColor = g => {
    if (!g) return 'var(--text-light)';
    if (g >= 90) return '#5BCC8A';
    if (g >= 75) return '#4285F4';
    return '#FA9058';
  };

  const ICONS = ['🧮','🔬','📖','🎨','🌍','🕌','⚽'];
  const BGS   = ['#FFF0E8','#E8FBF0','#E8F4FF','#FFFBE8','#F0E8FF','#FFE8F5','#F0F8FF'];

  if (openClass) {
    return (
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>📚 {openClass.class_name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Grade {openClass.grade} · {openClass.number_of_students} students</p>
          </div>
          <button className="btn-ghost" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => setOpenClass(null)}>← All Classes</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => openClassDetail(openClass)} style={{ padding: '8px 18px', borderRadius: 20, border: 'none', background: activeTab === 'students' ? 'var(--orange)' : 'var(--apricot)', color: activeTab === 'students' ? 'white' : 'var(--text-mid)', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>📊 Grades</button>
          <button onClick={loadAttendance} style={{ padding: '8px 18px', borderRadius: 20, border: 'none', background: activeTab === 'attendance' ? 'var(--orange)' : 'var(--apricot)', color: activeTab === 'attendance' ? 'white' : 'var(--text-mid)', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>✅ Attendance</button>
        </div>

        {studLoading ? <p style={{ color: 'var(--text-light)', fontSize: 13 }}>Loading students...</p> :
         activeTab === 'students' ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="kiddo-table">
              <thead><tr><th>#</th><th>Student Name</th><th>Avg Grade</th><th>Assignments</th></tr></thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-light)', padding: 24 }}>No students found for this class</td></tr>
                ) : students.map((s, i) => (
                  <tr key={s.username}>
                    <td style={{ color: 'var(--text-light)', fontWeight: 700 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--apricot)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--orange)', flexShrink: 0 }}>{s.first_name?.[0]}</div>
                        <span style={{ fontWeight: 700 }}>{s.first_name} {s.last_name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: "'Baloo 2',cursive", fontSize: 15, fontWeight: 800, color: gradeColor(s.avg) }}>{s.avg != null ? `${s.avg}%` : '—'}</span></td>
                    <td>{s.grades?.length || 0} grade(s)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         ) : (
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="kiddo-table">
                <thead><tr><th>#</th><th>Student Name</th><th>Today's Status</th></tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.username}>
                      <td style={{ color: 'var(--text-light)', fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ fontWeight: 700 }}>{s.first_name} {s.last_name}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {['present','absent','late'].map(st => (
                            <button key={st} onClick={() => setAttendance(prev => ({ ...prev, [s.username]: st }))}
                              style={{ padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif",
                                background: attendance[s.username] === st ? (st==='present'?'#5BCC8A':st==='absent'?'#FA9058':'#FECC64') : '#F5EDE6',
                                color: attendance[s.username] === st ? 'white' : 'var(--text-mid)'
                              }}>{st}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={saveAttendance} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Attendance ✅'}</button>
            </div>
          </div>
         )}
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>📚 My Classes</h2><p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>View students, grades and attendance</p></div>
      {loading ? <p style={{ color: 'var(--text-light)', fontSize: 13 }}>Loading classes...</p> :
       classes.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No classes assigned yet.</div> :
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {classes.map((c, i) => (
          <div key={c.class_number} className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: BGS[i%BGS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{ICONS[i%ICONS.length]}</div>
              <div>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, color: 'var(--text-dark)' }}>{c.class_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>Grade {c.grade} · {c.teacher_name}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, background: 'var(--apricot)', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 18, fontWeight: 800 }}>{c.number_of_students}</div>
                <div style={{ fontSize: 10, color: 'var(--text-mid)', fontWeight: 700, textTransform: 'uppercase' }}>Students</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, fontWeight: 700, color: 'var(--orange)', cursor: 'pointer' }} onClick={() => openClassDetail(c)}>View Students →</div>
          </div>
        ))}
       </div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCHEDULE PAGE — uses updated mockData
// ─────────────────────────────────────────────────────────────
export function SchedulePage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const todayIdx = new Date().getDay();
  const todayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][todayIdx];
  const [activeDay, setActiveDay] = useState(days.includes(todayName) ? todayName : 'Sun');

  const typeStyle = {
    class: { bg: '#FFF8F5', border: '#FA9058', pillBg: '#FFF0E8', pillColor: '#FA9058', label: 'Class' },
    trip:  { bg: '#F0F8FF', border: '#95CAFC', pillBg: '#E8F4FF', pillColor: '#4285F4', label: 'School Trip' },
    event: { bg: '#F5F0FF', border: '#7B52AB', pillBg: '#F0ECFF', pillColor: '#7B52AB', label: 'Event' },
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>📅 Weekly Schedule</h2><p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Your teaching timetable</p></div>
      <div className="card">
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {days.map(d => (
            <button key={d} className={`dtab ${activeDay === d ? 'active' : ''}`} onClick={() => setActiveDay(d)}>
              {['Sunday','Monday','Tuesday','Wednesday','Thursday'][days.indexOf(d)]}
              {d === todayName && activeDay !== d && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block', marginLeft: 6, verticalAlign: 'middle' }} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(SCHEDULE[activeDay] || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)', fontSize: 14 }}>No classes scheduled for this day</div>
          ) : (SCHEDULE[activeDay] || []).map((item, i) => {
            const s = typeStyle[item.type] || typeStyle.class;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: s.bg, borderLeft: `4px solid ${s.border}` }}>
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dark)' }}>{item.time}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-light)' }}>{item.dur}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>{item.subject}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{item.className}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: 'var(--apricot)', color: 'var(--text-mid)' }}>{item.room}</div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: s.pillBg, color: s.pillColor }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PARENTS PAGE
// ─────────────────────────────────────────────────────────────
export function ParentsPage() {
  const { token, user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const load = (grade) => {
    fetch(`${API}/groupchat?grade=${grade}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMessages(data); })
      .catch(() => {});
  };

  useEffect(() => {
    load(selectedGrade);
    const interval = setInterval(() => load(selectedGrade), 8000);
    return () => clearInterval(interval);
  }, [token, selectedGrade]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/groupchat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ grade: selectedGrade, content: input.trim() }),
      });
      const data = await res.json();
      if (data.success) { setInput(''); load(selectedGrade); }
    } catch {}
    setSending(false);
  };

  const grades = [
    { grade: 1, name: 'KG1', color: '#FA9058', bg: '#FFF0E8' },
    { grade: 2, name: 'KG2', color: '#5BCC8A', bg: '#E8FBF0' },
    { grade: 3, name: 'KG3', color: '#4285F4', bg: '#E8F4FF' },
  ];
  const currentGrade = grades.find(g => g.grade === selectedGrade);

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>👨‍👩‍👧 Parents Groups</h2>
        <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Chat with parents — messages are visible to parents in each grade</p>
      </div>

      {/* Grade selector */}
      <div style={{ display: 'flex', gap: 10 }}>
        {grades.map(g => (
          <button key={g.grade} onClick={() => setSelectedGrade(g.grade)} style={{
            padding: '10px 24px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: selectedGrade === g.grade ? g.color : g.bg,
            color: selectedGrade === g.grade ? 'white' : g.color,
            fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14,
            boxShadow: selectedGrade === g.grade ? `0 4px 14px ${g.color}44` : 'none',
            transition: 'all 0.2s',
          }}>{g.name} Parents</button>
        ))}
      </div>

      {/* Chat window */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 320px)', minHeight: 400 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottom: '1px solid #F5EDE6', marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: currentGrade?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: `2px solid ${currentGrade?.color}33` }}>👨‍👩‍👧</div>
          <div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 700 }}>{currentGrade?.name} — Parents & Teachers Group</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Messages visible to all parents and teachers in this grade</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', gap: 12, padding: 40 }}>
              <div style={{ fontSize: 48, opacity: 0.35 }}>💬</div>
              <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 16, fontWeight: 700, color: 'var(--text-mid)' }}>No messages yet</div>
              <div style={{ fontSize: 13 }}>Send the first message to {currentGrade?.name} parents!</div>
            </div>
          ) : messages.map(m => {
            const isMe = m.sender_type === 'teacher';
            const isParent = m.sender_type === 'student';
            return (
              <div key={m.message_id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 3, padding: '0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isParent && <span style={{ background: '#E8F4FF', color: '#4285F4', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 10 }}>Parent</span>}
                  {m.sender_name}
                </div>
                <div style={{
                  background: isMe ? 'linear-gradient(135deg,var(--orange),#f97040)' : 'var(--apricot)',
                  color: isMe ? 'white' : 'var(--text-dark)',
                  padding: '10px 14px',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: 13, maxWidth: '75%', lineHeight: 1.5
                }}>{m.content}</div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 3, padding: '0 4px' }}>
                  {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid #F5EDE6' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={`Message ${currentGrade?.name} parents…`}
            style={{ flex: 1, margin: 0, padding: '10px 16px', borderRadius: 30, border: '2px solid #F5EDE6', fontFamily: "'Nunito',sans-serif", fontSize: 13, outline: 'none' }}
          />
          <button onClick={send} disabled={sending} style={{
            width: 42, height: 42, borderRadius: '50%',
            background: sending ? '#ccc' : 'linear-gradient(135deg, var(--orange), #f97040)',
            border: 'none', color: 'white', fontSize: 17, cursor: sending ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>➤</button>
        </div>
      </div>
    </div>
  );
}


export function ProfilePage({ teacher }) {
  const Field = ({ label, value, full }) => (
    <div className="p-field" style={full ? { gridColumn: '1 / -1' } : {}}>
      <div className="p-field-l">{label}</div>
      <div className="p-field-v">{value || '—'}</div>
    </div>
  );
  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800 }}>👤 My Profile</h2><p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>Your account and school information</p></div>
      <div className="prof-hero">
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', flexShrink: 0, border: '3px solid rgba(255,255,255,0.5)' }}>
          {teacher.initials}
        </div>
        <div>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 800, color: 'white' }}>{teacher.firstName} {teacher.lastName}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {[teacher.class || 'Teacher', `ID: ${teacher.id}`].map(chip => (
              <span key={chip} style={{ background: 'rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'white' }}>{chip}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🎓 Teacher Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="First Name" value={teacher.firstName} />
          <Field label="Last Name"  value={teacher.lastName} />
          <Field label="Teacher ID" value={teacher.id} />
          <Field label="Class"      value={teacher.class} />
          <Field label="School"     value={teacher.school} full />
        </div>
      </div>
    </div>
  );
}
