import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function AdminDashboardPage({ onNavigate }) {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/stats`,    { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()),
      fetch(`${API}/admin/teachers`, { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()),
      fetch(`${API}/admin/students`, { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()),
    ]).then(([s,t,st]) => {
      setStats(s); setTeachers(Array.isArray(t)?t:[]); setStudents(Array.isArray(st)?st:[]);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, [token]);

  const Card = ({ color, icon, value, label, sub }) => (
    <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-16, right:-16, width:60, height:60, borderRadius:"50%", background:color, opacity:0.12 }}/>
      <div style={{ width:42, height:42, borderRadius:12, background:color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:10 }}>{icon}</div>
      <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800 }}>{loading?"—":value}</div>
      <div style={{ fontSize:12, fontWeight:700, color:"var(--text-mid)", textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:"var(--text-light)", marginTop:2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Welcome */}
      <div style={{ background:"linear-gradient(135deg,#3D2B1F,#7A5C4A)", borderRadius:16, padding:"22px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", fontSize:60, opacity:0.15 }}>👑</div>
        <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:"white" }}>Welcome, {user?.firstName}! 👋</h2>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:4 }}>{new Date().toLocaleDateString("en-US",{ weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        <Card color="#FA9058" icon="👩‍🏫" value={stats?.teachers||0}       label="Teachers"        sub="Active staff" />
        <Card color="#5BCC8A" icon="🧒"   value={stats?.students||0}       label="Students"        sub="Enrolled" />
        <Card color="#95CAFC" icon="✅"   value={stats?.present_today||0}  label="Present Today"   sub="Teachers" />
        <Card color="#FECC64" icon="📢"   value={stats?.announcements||0}  label="Announcements"   sub="Total posted" />
      </div>

      {/* Teachers & Students tables */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Teachers */}
        <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:700 }}>👩‍🏫 Teachers</div>
            <button onClick={()=>onNavigate("register")} style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"#FFF0E8", color:"var(--orange)", border:"none", cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>＋ Add</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {loading ? <p style={{ color:"var(--text-light)", fontSize:13 }}>Loading…</p> :
             teachers.slice(0,6).map(t => (
              <div key={t.teacher_id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #F5EDE6" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,var(--azure),var(--apogyan))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
                  {t.teacher_name.replace(/Ms\.?\s|Mr\.?\s/,"").split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{t.teacher_name}</div>
                  <div style={{ fontSize:11, color:"var(--text-light)" }}>{t.class}</div>
                </div>
                <div style={{ fontSize:11, color:"var(--text-light)" }}>{t.teacher_id}</div>
              </div>
            ))}
            {teachers.length > 6 && <p style={{ fontSize:12, color:"var(--text-light)", textAlign:"center" }}>+{teachers.length-6} more</p>}
          </div>
        </div>

        {/* Students */}
        <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:700 }}>🧒 Students</div>
            <button onClick={()=>onNavigate("register")} style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"#E8FBF0", color:"#5BCC8A", border:"none", cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>＋ Add</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {loading ? <p style={{ color:"var(--text-light)", fontSize:13 }}>Loading…</p> :
             students.slice(0,6).map(s => (
              <div key={s.username} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #F5EDE6" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,var(--sun),var(--orange))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
                  {s.first_name[0]}{s.last_name[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{s.first_name} {s.last_name}</div>
                  <div style={{ fontSize:11, color:"var(--text-light)" }}>Grade {s.grade} · {s.username}</div>
                </div>
              </div>
            ))}
            {students.length > 6 && <p style={{ fontSize:12, color:"var(--text-light)", textAlign:"center" }}>+{students.length-6} more</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
