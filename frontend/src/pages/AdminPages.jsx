import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function useAdminFetch(endpoint) {
  const { token } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const load = () => {
    fetch(`${API}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, [endpoint, token]);
  return { data, loading, reload: load };
}

async function adminPost(endpoint, body, token, method='POST') {
  const res = await fetch(`${API}${endpoint}`, {
    method, headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ─────────────────────────────────────────────
// OVERVIEW PAGE
// ─────────────────────────────────────────────
export function AdminAnnouncementsPage() {
  const { token } = useAuth();
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', badge_type:'Info', target_grade:'' });
  const [msg, setMsg] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () => {
    fetch(`${API}/announcements`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(d=>{ setAnns(Array.isArray(d)?d:[]); setLoading(false); }).catch(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[token]);

  const post = async () => {
    if (!form.title.trim()) { setMsg('Title required.'); return; }
    setPosting(true); setMsg('');
    const res = await adminPost('/announcements', { ...form, target_grade: form.target_grade||null }, token);
    setMsg(res.success ? '✅ Posted!' : res.error||'Failed.');
    if (res.success) { setForm({ title:'',description:'',badge_type:'Info',target_grade:'' }); setShowForm(false); load(); }
    setPosting(false);
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await adminPost(`/announcements/${id}`, {}, token, 'DELETE');
    load();
  };

  const BADGE = { Info:{bg:'#E8F4FF',c:'#4285F4'}, Urgent:{bg:'#FFF0E8',c:'#FA9058'}, New:{bg:'#E8FBF0',c:'#5BCC8A'}, Event:{bg:'#F0ECFF',c:'#7B52AB'}, Academic:{bg:'#FFF0E8',c:'#FA9058'}, Homework:{bg:'#FFFBE8',c:'#C9960A'} };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div><h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800 }}>📢 Announcements</h2><p style={{ fontSize:13, color:'var(--text-mid)' }}>Post to students and teachers</p></div>
        <button onClick={()=>setShowForm(p=>!p)} style={{ padding:'10px 20px', borderRadius:20, border:'none', background:'var(--orange)', color:'white', fontFamily:"'Nunito',sans-serif", fontWeight:700, cursor:'pointer' }}>＋ New</button>
      </div>
      {msg && <div style={{ padding:'10px 14px', borderRadius:10, background:msg.startsWith('✅')?'#E8FBF0':'#FFF0E8', color:msg.startsWith('✅')?'#34A853':'#FA9058', fontSize:13 }}>{msg}</div>}
      {showForm && (
        <div style={{ background:'white', borderRadius:16, padding:20, border:'2px solid var(--yellow)' }}>
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Title…" style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:14, outline:'none', marginBottom:10, boxSizing:'border-box' }} />
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Description…" style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:14, outline:'none', minHeight:80, marginBottom:10, boxSizing:'border-box', resize:'vertical' }} />
          <div style={{ display:'flex', gap:10 }}>
            <select value={form.badge_type} onChange={e=>setForm(f=>({...f,badge_type:e.target.value}))} style={{ padding:'8px 12px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:13 }}>
              {['Info','Urgent','New','Event','Academic','Homework'].map(t=><option key={t}>{t}</option>)}
            </select>
            <select value={form.target_grade} onChange={e=>setForm(f=>({...f,target_grade:e.target.value}))} style={{ padding:'8px 12px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:13 }}>
              <option value="">All Grades</option>
              <option value="1">Grade 1</option><option value="2">Grade 2</option><option value="3">Grade 3</option>
            </select>
            <button onClick={post} disabled={posting} style={{ padding:'8px 18px', borderRadius:10, border:'none', background:'var(--orange)', color:'white', fontFamily:"'Nunito',sans-serif", fontWeight:700, cursor:'pointer' }}>{posting?'Posting…':'Post ✅'}</button>
            <button onClick={()=>setShowForm(false)} style={{ padding:'8px 18px', borderRadius:10, border:'none', background:'#F5EDE6', color:'var(--text-mid)', fontFamily:"'Nunito',sans-serif", fontWeight:700, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <p style={{ color:'var(--text-light)', fontSize:13 }}>Loading…</p> :
       anns.length===0 ? <p style={{ textAlign:'center', color:'var(--text-light)', padding:40 }}>No announcements yet.</p> :
       anns.map(a => {
         const b = BADGE[a.badge_type]||BADGE.Info;
         return (
           <div key={a.announcement_id} style={{ background:'white', borderRadius:14, padding:'16px 20px', borderLeft:`4px solid ${b.c}`, display:'flex', gap:12, alignItems:'start' }}>
             <div style={{ flex:1 }}>
               <div style={{ fontWeight:700, fontSize:14 }}>{a.title}</div>
               {a.description && <div style={{ fontSize:13, color:'var(--text-mid)', marginTop:4, lineHeight:1.5 }}>{a.description}</div>}
               <div style={{ fontSize:11, color:'var(--text-light)', marginTop:8 }}>📅 {new Date(a.date_posted).toLocaleDateString()} · 👤 {a.author} · 🎯 {a.target_grade?`Grade ${a.target_grade}`:'All'}</div>
             </div>
             <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
               <span style={{ fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:20, background:b.bg, color:b.c }}>{a.badge_type}</span>
               <button onClick={()=>del(a.announcement_id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#ccc' }}>🗑</button>
             </div>
           </div>
         );
       })}
    </div>
  );
}

// ─────────────────────────────────────────────
// TEACHER CHAT PAGE
// ─────────────────────────────────────────────
export function AdminChatPage() {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/admin/teachers`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setTeachers(d); }).catch(()=>{});
  }, [token]);

  const loadMsgs = (tid) => {
    fetch(`${API}/admin/chat/${tid}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setMessages(d); }).catch(()=>{});
  };

  useEffect(() => {
    if (!selected) return;
    loadMsgs(selected.teacher_id);
    const iv = setInterval(()=>loadMsgs(selected.teacher_id), 5000);
    return ()=>clearInterval(iv);
  }, [selected, token]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim()||!selected) return;
    setSending(true);
    const res = await adminPost('/admin/chat', { teacher_id:selected.teacher_id, content:input.trim() }, token);
    if (res.success) { setInput(''); loadMsgs(selected.teacher_id); }
    setSending(false);
  };

  return (
    <div style={{ display:'flex', gap:20, height:'calc(100vh - 160px)', minHeight:500 }}>
      {/* Teacher list */}
      <div style={{ width:260, background:'white', borderRadius:16, padding:16, display:'flex', flexDirection:'column', gap:4, overflow:'auto', flexShrink:0 }}>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:700, marginBottom:10 }}>Teachers</div>
        {teachers.map(t => (
          <div key={t.teacher_id} onClick={()=>{ setSelected(t); setMessages([]); }}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, cursor:'pointer',
              background: selected?.teacher_id===t.teacher_id ? 'var(--apricot)' : 'transparent' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,var(--azure),var(--apogyan))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, flexShrink:0 }}>
              {t.teacher_name.replace(/Ms\.?\s|Mr\.?\s/,'').split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div><div style={{ fontSize:13, fontWeight:700 }}>{t.teacher_name}</div><div style={{ fontSize:11, color:'var(--text-light)' }}>{t.class}</div></div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div style={{ flex:1, background:'white', borderRadius:16, padding:20, display:'flex', flexDirection:'column' }}>
        {!selected ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, color:'var(--text-light)' }}>
            <div style={{ fontSize:48, opacity:0.3 }}>💬</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:700, color:'var(--text-mid)' }}>Select a teacher</div>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:14, borderBottom:'1px solid #F5EDE6', marginBottom:14 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,var(--azure),var(--apogyan))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>
                {selected.teacher_name.replace(/Ms\.?\s|Mr\.?\s/,'').split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div><div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:700 }}>{selected.teacher_name}</div><div style={{ fontSize:12, color:'var(--text-light)' }}>{selected.class}</div></div>
            </div>
            <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingBottom:8 }}>
              {messages.length===0 ? <p style={{ color:'var(--text-light)', fontSize:13, textAlign:'center', padding:40 }}>No messages yet. Start the conversation!</p> :
               messages.map(m => (
                <div key={m.chat_id} style={{ display:'flex', flexDirection:'column', alignItems:m.sender_type==='admin'?'flex-end':'flex-start', marginBottom:6 }}>
                  <div style={{ fontSize:11, color:'var(--text-light)', marginBottom:3, padding:'0 4px' }}>{m.sender_name}</div>
                  <div style={{ background:m.sender_type==='admin'?'linear-gradient(135deg,var(--orange),#f97040)':'var(--apricot)', color:m.sender_type==='admin'?'white':'var(--text-dark)', padding:'10px 14px', borderRadius:m.sender_type==='admin'?'18px 18px 4px 18px':'18px 18px 18px 4px', fontSize:13, maxWidth:'75%' }}>{m.content}</div>
                  <div style={{ fontSize:10, color:'var(--text-light)', marginTop:3, padding:'0 4px' }}>{new Date(m.sent_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
               ))}
              <div ref={bottomRef}/>
            </div>
            <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid #F5EDE6' }}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
                placeholder={`Message ${selected.teacher_name}…`}
                style={{ flex:1, padding:'10px 16px', borderRadius:30, border:'2px solid #F5EDE6', fontFamily:"'Nunito',sans-serif", fontSize:13, outline:'none' }}/>
              <button onClick={send} disabled={sending} style={{ width:42, height:42, borderRadius:'50%', background:sending?'#ccc':'linear-gradient(135deg,var(--orange),#f97040)', border:'none', color:'white', fontSize:18, cursor:sending?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>➤</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ATTENDANCE PAGE
// ─────────────────────────────────────────────
export function AdminAttendancePage() {
  const { token } = useAuth();
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState({});
  const [msg, setMsg]           = useState('');

  const load = (d) => {
    setLoading(true);
    fetch(`${API}/admin/attendance?date=${d}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(data=>{ if(Array.isArray(data)) setTeachers(data); setLoading(false); }).catch(()=>setLoading(false));
  };

  useEffect(()=>{ load(date); },[token, date]);

  const mark = async (teacher_id, status) => {
    setSaving(p=>({...p,[teacher_id]:true}));
    const res = await adminPost('/admin/attendance', { teacher_id, status, date }, token);
    if (res.success) { setMsg('✅ Saved!'); load(date); setTimeout(()=>setMsg(''),2000); }
    setSaving(p=>({...p,[teacher_id]:false}));
  };

  const STATUS = { present:{ bg:'#5BCC8A', label:'Present' }, absent:{ bg:'#FA9058', label:'Absent' }, late:{ bg:'#FECC64', label:'Late' } };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div><h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800 }}>✅ Teacher Attendance</h2><p style={{ fontSize:13, color:'var(--text-mid)' }}>Track daily teacher attendance</p></div>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ padding:'8px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:13, outline:'none' }} />
      </div>
      {msg && <div style={{ padding:'10px 14px', borderRadius:10, background:'#E8FBF0', color:'#34A853', fontSize:13 }}>{msg}</div>}
      <div style={{ background:'white', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'Nunito',sans-serif" }}>
          <thead>
            <tr style={{ background:'var(--apricot)' }}>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-light)' }}>#</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-light)' }}>Teacher</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-light)' }}>Class</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-light)' }}>Status</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-light)' }}>Mark As</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ textAlign:'center', padding:24, color:'var(--text-light)' }}>Loading…</td></tr> :
             teachers.map((t,i) => (
              <tr key={t.teacher_id} style={{ borderBottom:'1px solid #F5EDE6' }}>
                <td style={{ padding:'12px 16px', color:'var(--text-light)', fontWeight:700 }}>{i+1}</td>
                <td style={{ padding:'12px 16px', fontWeight:700 }}>{t.teacher_name}</td>
                <td style={{ padding:'12px 16px', color:'var(--text-mid)', fontSize:13 }}>{t.class}</td>
                <td style={{ padding:'12px 16px' }}>
                  {t.status ? (
                    <span style={{ fontSize:11, fontWeight:800, padding:'4px 12px', borderRadius:20, background:STATUS[t.status]?.bg+'22', color:STATUS[t.status]?.bg, textTransform:'capitalize' }}>{t.status}</span>
                  ) : <span style={{ fontSize:11, color:'var(--text-light)' }}>Not marked</span>}
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {['present','absent','late'].map(s => (
                      <button key={s} onClick={()=>mark(t.teacher_id, s)} disabled={saving[t.teacher_id]}
                        style={{ padding:'4px 12px', borderRadius:20, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif",
                          background: t.status===s ? STATUS[s].bg : '#F5EDE6',
                          color: t.status===s ? 'white' : 'var(--text-mid)',
                          opacity: saving[t.teacher_id] ? 0.6 : 1 }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// KPI PAGE
// ─────────────────────────────────────────────
export function AdminKPIPage() {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [kpis, setKpis]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ teacher_id:'', title:'', description:'', status:'pending', is_top_performer:false });
  const [msg, setMsg]           = useState('');

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/admin/teachers`, { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()),
      fetch(`${API}/admin/kpi`,      { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()),
    ]).then(([t,k]) => {
      if (Array.isArray(t)) setTeachers(t);
      if (Array.isArray(k)) setKpis(k);
      setLoading(false);
    }).catch(()=>setLoading(false));
  };

  useEffect(()=>{ loadAll(); },[token]);

  const add = async () => {
    if (!form.teacher_id||!form.title) { setMsg('Teacher and title required.'); return; }
    setMsg('');
    const res = await adminPost('/admin/kpi', form, token);
    if (res.success) { setMsg('✅ Added!'); setShowForm(false); setForm({ teacher_id:'', title:'', description:'', status:'pending', is_top_performer:false }); loadAll(); }
    else setMsg(res.error||'Failed.');
  };

  const update = async (id, status, is_top_performer) => {
    await adminPost(`/admin/kpi/${id}`, { status, is_top_performer }, token, 'PUT');
    loadAll();
  };

  const del = async (id) => {
    if (!confirm('Delete this action item?')) return;
    await adminPost(`/admin/kpi/${id}`, {}, token, 'DELETE');
    loadAll();
  };

  const topPerformers = kpis.filter(k=>k.is_top_performer);
  const STATUS_STYLE = { pending:{bg:'#FFF0E8',c:'#FA9058'}, inprogress:{bg:'#E8F4FF',c:'#4285F4'}, completed:{bg:'#E8FBF0',c:'#5BCC8A'} };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div><h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800 }}>🏆 Teacher KPI</h2><p style={{ fontSize:13, color:'var(--text-mid)' }}>Track performance and assign action items</p></div>
        <button onClick={()=>setShowForm(p=>!p)} style={{ padding:'10px 20px', borderRadius:20, border:'none', background:'var(--orange)', color:'white', fontFamily:"'Nunito',sans-serif", fontWeight:700, cursor:'pointer' }}>＋ Add Action Item</button>
      </div>

      {msg && <div style={{ padding:'10px 14px', borderRadius:10, background:msg.startsWith('✅')?'#E8FBF0':'#FFF0E8', color:msg.startsWith('✅')?'#34A853':'#FA9058', fontSize:13 }}>{msg}</div>}

      {/* Top performers */}
      {topPerformers.length > 0 && (
        <div style={{ background:'linear-gradient(135deg,#FECC64,#FA9058)', borderRadius:16, padding:20 }}>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'white', marginBottom:12 }}>⭐ Top Performers</div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {[...new Set(topPerformers.map(k=>k.teacher_name))].map(name => (
              <span key={name} style={{ background:'rgba(255,255,255,0.3)', color:'white', padding:'6px 16px', borderRadius:20, fontSize:13, fontWeight:700 }}>{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div style={{ background:'white', borderRadius:16, padding:20, border:'2px solid var(--yellow)' }}>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:700, marginBottom:14 }}>➕ New Action Item</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <select value={form.teacher_id} onChange={e=>setForm(f=>({...f,teacher_id:e.target.value}))} style={{ padding:'10px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:13, outline:'none' }}>
              <option value="">Select teacher…</option>
              {teachers.map(t=><option key={t.teacher_id} value={t.teacher_id}>{t.teacher_name}</option>)}
            </select>
            <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={{ padding:'10px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:13, outline:'none' }}>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Action item title…" style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:14, outline:'none', marginBottom:10, boxSizing:'border-box' }} />
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Description (optional)…" style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:13, outline:'none', minHeight:70, marginBottom:10, boxSizing:'border-box', resize:'vertical' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <input type="checkbox" checked={form.is_top_performer} onChange={e=>setForm(f=>({...f,is_top_performer:e.target.checked}))} />
              ⭐ Mark as Top Performer
            </label>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={add} style={{ padding:'8px 20px', borderRadius:10, border:'none', background:'var(--orange)', color:'white', fontFamily:"'Nunito',sans-serif", fontWeight:700, cursor:'pointer' }}>Add ✅</button>
            <button onClick={()=>setShowForm(false)} style={{ padding:'8px 20px', borderRadius:10, border:'none', background:'#F5EDE6', color:'var(--text-mid)', fontFamily:"'Nunito',sans-serif", fontWeight:700, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* KPI list */}
      {loading ? <p style={{ color:'var(--text-light)', fontSize:13 }}>Loading…</p> :
       kpis.length===0 ? <p style={{ textAlign:'center', color:'var(--text-light)', padding:40 }}>No action items yet.</p> :
       <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {kpis.map(k => {
          const ss = STATUS_STYLE[k.status]||STATUS_STYLE.pending;
          return (
            <div key={k.kpi_id} style={{ background:'white', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'start', gap:14, borderLeft:`4px solid ${ss.c}` }}>
              {k.is_top_performer && <span style={{ fontSize:18 }}>⭐</span>}
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{k.title}</div>
                <div style={{ fontSize:12, color:'var(--text-mid)', marginTop:2 }}>{k.teacher_name}</div>
                {k.description && <div style={{ fontSize:13, color:'var(--text-mid)', marginTop:6, lineHeight:1.5 }}>{k.description}</div>}
                <div style={{ display:'flex', gap:8, marginTop:10 }}>
                  {['pending','inprogress','completed'].map(s => (
                    <button key={s} onClick={()=>update(k.kpi_id, s, k.is_top_performer)}
                      style={{ padding:'3px 12px', borderRadius:20, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif", background:k.status===s?STATUS_STYLE[s].c:'#F5EDE6', color:k.status===s?'white':'var(--text-mid)' }}>
                      {s}
                    </button>
                  ))}
                  <button onClick={()=>update(k.kpi_id, k.status, !k.is_top_performer)} style={{ padding:'3px 12px', borderRadius:20, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif", background:k.is_top_performer?'#FECC64':'#F5EDE6', color:k.is_top_performer?'#3D2B1F':'var(--text-mid)' }}>
                    {k.is_top_performer?'⭐ Top':'☆ Top'}
                  </button>
                </div>
              </div>
              <button onClick={()=>del(k.kpi_id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#ccc', flexShrink:0 }}>🗑</button>
            </div>
          );
        })}
       </div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// REGISTER PAGE
// ─────────────────────────────────────────────
export function AdminRegisterPage() {
  const { token } = useAuth();
  const [tab, setTab]   = useState('teacher');
  const [msg, setMsg]   = useState('');
  const [loading, setLoading] = useState(false);
  const [teacherForm, setTF] = useState({ teacher_id:'', teacher_name:'', class:'', password:'' });
  const [studentForm, setSF] = useState({ username:'', first_name:'', last_name:'', phone_number:'', date_of_birth:'', address:'', grade:1, medical_condition:'None', password:'' });

  const registerTeacher = async () => {
    if (!teacherForm.teacher_id||!teacherForm.teacher_name||!teacherForm.password) { setMsg('All fields required.'); return; }
    setLoading(true); setMsg('');
    const res = await adminPost('/admin/register/teacher', teacherForm, token);
    setMsg(res.success ? `✅ ${res.message}` : res.error||'Failed.');
    if (res.success) setTF({ teacher_id:'', teacher_name:'', class:'', password:'' });
    setLoading(false);
  };

  const registerStudent = async () => {
    if (!studentForm.username||!studentForm.first_name||!studentForm.last_name||!studentForm.password) { setMsg('Required fields missing.'); return; }
    setLoading(true); setMsg('');
    const res = await adminPost('/admin/register/student', studentForm, token);
    setMsg(res.success ? `✅ ${res.message}` : res.error||'Failed.');
    if (res.success) setSF({ username:'', first_name:'', last_name:'', phone_number:'', date_of_birth:'', address:'', grade:1, medical_condition:'None', password:'' });
    setLoading(false);
  };

  const inp = { width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid #eee', fontFamily:"'Nunito',sans-serif", fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:12 };
  const lbl = { display:'block', fontSize:12, fontWeight:700, color:'var(--text-mid)', marginBottom:4 };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div><h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800 }}>👤 Register Account</h2><p style={{ fontSize:13, color:'var(--text-mid)' }}>Create teacher or student accounts</p></div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, background:'var(--sun)', padding:4, borderRadius:14, width:'fit-content' }}>
        {[['teacher','👩‍🏫 Teacher'],['student','🧒 Student']].map(([k,l]) => (
          <button key={k} onClick={()=>{ setTab(k); setMsg(''); }} style={{ padding:'8px 24px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, background:tab===k?'white':'transparent', color:tab===k?'var(--orange)':'var(--text-mid)', boxShadow:tab===k?'0 2px 8px rgba(0,0,0,0.07)':'none' }}>{l}</button>
        ))}
      </div>

      {msg && <div style={{ padding:'12px 16px', borderRadius:12, background:msg.startsWith('✅')?'#E8FBF0':'#FFF0E8', color:msg.startsWith('✅')?'#34A853':'#FA9058', fontSize:13, fontWeight:600 }}>{msg}</div>}

      <div style={{ background:'white', borderRadius:16, padding:24, maxWidth:600 }}>
        {tab==='teacher' ? (
          <div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:700, marginBottom:16 }}>👩‍🏫 New Teacher Account</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label style={lbl}>Teacher ID *</label><input style={inp} value={teacherForm.teacher_id} onChange={e=>setTF(f=>({...f,teacher_id:e.target.value}))} placeholder="e.g. KG011" /></div>
              <div><label style={lbl}>Full Name *</label><input style={inp} value={teacherForm.teacher_name} onChange={e=>setTF(f=>({...f,teacher_name:e.target.value}))} placeholder="e.g. Ms. Sara Ahmed" /></div>
              <div><label style={lbl}>Class</label><input style={inp} value={teacherForm.class} onChange={e=>setTF(f=>({...f,class:e.target.value}))} placeholder="e.g. KG1 Arabic" /></div>
              <div><label style={lbl}>Password *</label><input style={inp} type="password" value={teacherForm.password} onChange={e=>setTF(f=>({...f,password:e.target.value}))} placeholder="Set a password" /></div>
            </div>
            <button onClick={registerTeacher} disabled={loading} style={{ padding:'12px 28px', borderRadius:12, border:'none', background:'var(--orange)', color:'white', fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer' }}>{loading?'Creating…':'Create Teacher Account ✅'}</button>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:700, marginBottom:16 }}>🧒 New Student Account</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label style={lbl}>Username *</label><input style={inp} value={studentForm.username} onChange={e=>setSF(f=>({...f,username:e.target.value}))} placeholder="e.g. sara_ali_k1_11" /></div>
              <div><label style={lbl}>Grade *</label>
                <select style={{ ...inp, marginBottom:0 }} value={studentForm.grade} onChange={e=>setSF(f=>({...f,grade:parseInt(e.target.value)}))}>
                  <option value={1}>Grade 1 (KG1)</option><option value={2}>Grade 2 (KG2)</option><option value={3}>Grade 3 (KG3)</option>
                </select>
              </div>
              <div><label style={lbl}>First Name *</label><input style={inp} value={studentForm.first_name} onChange={e=>setSF(f=>({...f,first_name:e.target.value}))} placeholder="First name" /></div>
              <div><label style={lbl}>Last Name *</label><input style={inp} value={studentForm.last_name} onChange={e=>setSF(f=>({...f,last_name:e.target.value}))} placeholder="Last name" /></div>
              <div><label style={lbl}>Phone Number</label><input style={inp} value={studentForm.phone_number} onChange={e=>setSF(f=>({...f,phone_number:e.target.value}))} placeholder="05xxxxxxxx" /></div>
              <div><label style={lbl}>Date of Birth</label><input style={{ ...inp }} type="date" value={studentForm.date_of_birth} onChange={e=>setSF(f=>({...f,date_of_birth:e.target.value}))} /></div>
              <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Address</label><input style={inp} value={studentForm.address} onChange={e=>setSF(f=>({...f,address:e.target.value}))} placeholder="Address" /></div>
              <div><label style={lbl}>Medical Condition</label><input style={inp} value={studentForm.medical_condition} onChange={e=>setSF(f=>({...f,medical_condition:e.target.value}))} placeholder="None" /></div>
              <div><label style={lbl}>Password *</label><input style={inp} type="password" value={studentForm.password} onChange={e=>setSF(f=>({...f,password:e.target.value}))} placeholder="Set a password" /></div>
            </div>
            <button onClick={registerStudent} disabled={loading} style={{ padding:'12px 28px', borderRadius:12, border:'none', background:'var(--orange)', color:'white', fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer' }}>{loading?'Creating…':'Create Student Account ✅'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
