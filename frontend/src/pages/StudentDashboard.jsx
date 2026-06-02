import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import Sidebar from "../components/Sidebar";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
const COLORS = ["#FA9058","#5BCC8A","#95CAFC","#FECC64","#B59BFF","#FA9058"];
const COURSE_STYLES = [
  {icon:"🧮",bg:"#FFF0E8"},{icon:"🔬",bg:"#E8FBF0"},{icon:"📖",bg:"#E8F4FF"},
  {icon:"🎨",bg:"#FFFBE8"},{icon:"🌍",bg:"#F0E8FF"},{icon:"🕌",bg:"#FFE8F5"},
];
const BADGE = { New:{bg:"#FFF0E8",c:"#FA9058"}, Info:{bg:"#E8F4FF",c:"#4285F4"}, Urgent:{bg:"#FFFBE8",c:"#C9960A"} };
const STATUS_COLOR = { present:"#5BCC8A", absent:"#FA9058", late:"#FECC64" };

function EmptyState({ icon, title, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
      <span className="empty-chip">⏳ Waiting for database</span>
    </div>
  );
}

function fmt(t) {
  if (!t) return "";
  const [h,m] = t.split(":");
  const hr = parseInt(h);
  return `${hr>12?hr-12:hr||12}:${m} ${hr>=12?"PM":"AM"}`;
}

// ── Pages ──

function DashboardPage({ onNavigate }) {
  const { token, user } = useAuth();
  const today = DAYS[new Date().getDay()] || "Sunday";
  const [schedule, setSchedule] = useState(null);
  const [anns,     setAnns]     = useState(null);
  const [attData,  setAttData]  = useState(null);
  const [grades,   setGrades]   = useState(null);

  useEffect(() => {
    apiFetch(`/schedule?day=${today}`, token).then(setSchedule).catch(()=>setSchedule([]));
    apiFetch("/announcements", token).then(setAnns).catch(()=>setAnns([]));
    apiFetch("/attendance", token).then(setAttData).catch(()=>setAttData(null));
    apiFetch("/grades", token).then(setGrades).catch(()=>setGrades([]));
  }, [token, today]);

  const att = attData?.summary;
  const avgGrade = grades?.length ? Math.round(grades.reduce((s,g)=>s+(g.score/g.max_score)*100,0)/grades.length) : null;
  const firstName = user?.firstName || "Student";

  return (
    <div className="page">
      <div className="topbar">
        <div className="topbar-left">
          <h1>Good morning, {firstName}! 👋</h1>
          <p>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <div className="topbar-right">
          <button className="notif-btn">🔔<span className="notif-dot"/></button>
          <div className="topbar-avatar">{(user?.firstName?.[0]||"")+(user?.lastName?.[0]||"")}</div>
        </div>
      </div>

      <div className="today-banner">
        <h2>{schedule ? `${schedule.length} classes today` : "Loading..."}</h2>
        <p>Grade {user?.grade} · {today}</p>
        <div className="today-pills">
          {schedule?.map(s=><span key={s.schedule_id} className="today-pill">{s.class_name}</span>)}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card orange"><div className="stat-icon">📊</div><div className="stat-value">{avgGrade!=null?`${avgGrade}%`:"—"}</div><div className="stat-label">Avg. Grade</div><div className="stat-sub">Across all subjects</div></div>
        <div className="stat-card blue"><div className="stat-icon">✅</div><div className="stat-value">{att?`${att.percentage}%`:"—"}</div><div className="stat-label">Attendance</div><div className="stat-sub">{att?`${att.absent} absences`:"Loading..."}</div></div>
        <div className="stat-card yellow"><div className="stat-icon">📢</div><div className="stat-value">{anns?anns.length:"—"}</div><div className="stat-label">Announcements</div><div className="stat-sub">For your grade</div></div>
        <div className="stat-card green"><div className="stat-icon">📝</div><div className="stat-value">{grades?grades.length:"—"}</div><div className="stat-label">Grades</div><div className="stat-sub">Recorded so far</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Today\'s Schedule</div>
            <button className="card-link" onClick={()=>onNavigate("schedule")}>Full Schedule →</button>
          </div>
          {!schedule ? <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p> :
           schedule.length===0 ? <p style={{color:"var(--text-light)",fontSize:13}}>No classes today 🎉</p> :
           schedule.map((s,i)=>(
            <div key={s.schedule_id} className="period-item">
              <div className="period-time">{fmt(s.start_time)}–{fmt(s.end_time)}</div>
              <div className="period-bar" style={{background:COLORS[i%COLORS.length]}}/>
              <div className="period-info"><div className="period-subject">{s.class_name}</div><div className="period-teacher-name">{s.teacher_name}</div></div>
              <div className="period-room">{s.room_number}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📢 Announcements</div>
            <button className="card-link" onClick={()=>onNavigate("announcements")}>All →</button>
          </div>
          {!anns ? <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p> :
           anns.length===0 ? <EmptyState icon="📢" title="No announcements" sub="Check back later!"/> :
           anns.slice(0,3).map(a=>{
            const b=BADGE[a.badge_type]||BADGE.Info;
            return(
              <div key={a.announcement_id} className="ann-item">
                <div className="ann-dot" style={{background:b.c}}/>
                <div style={{flex:1}}>
                  <div className="ann-title">{a.title}</div>
                  <div className="ann-desc">{a.description}</div>
                  <div className="ann-meta">📌 {new Date(a.date_posted).toLocaleDateString()} · {a.author}</div>
                </div>
                <span className="ann-badge" style={{background:b.bg,color:b.c}}>{a.badge_type}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{display:"flex",gap:20}}>
        <div className="card" style={{flex:1.2}}>
          <div className="card-header">
            <div className="card-title">✅ Attendance</div>
            <button className="card-link" onClick={()=>onNavigate("attendance")}>History →</button>
          </div>
          {att ? (
            <div className="ring-wrap">
              <div className="ring">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F0E8E0" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#5BCC8A" strokeWidth="10"
                    strokeDasharray="251.2" strokeDashoffset={251.2-(att.percentage/100)*251.2} strokeLinecap="round"/>
                </svg>
                <div className="ring-center"><div className="ring-pct">{att.percentage}%</div><div className="ring-lbl">Present</div></div>
              </div>
              <div>
                {[["#5BCC8A","Present",att.present],["#FA9058","Absent",att.absent],["#FECC64","Late",att.late]].map(([c,l,v])=>(
                  <div key={l} className="legend-item"><div className="legend-dot" style={{background:c}}/><div className="legend-label">{l}</div><div className="legend-val">{v}</div></div>
                ))}
              </div>
            </div>
          ) : <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p>}
        </div>

        <div className="student-hero" style={{flex:1}}>
          <div className="student-avatar">👧</div>
          <div className="student-name">{user?.firstName} {user?.lastName}</div>
          <div className="student-chip">Grade {user?.grade}</div>
          <div className="info-rows">
            <div className="info-row"><span>🆔</span><div className="info-label">Username</div><div className="info-val">{user?.username}</div></div>
            <div className="info-row"><span>📊</span><div className="info-label">Avg Grade</div><div className="info-val">{avgGrade!=null?`${avgGrade}%`:"Loading..."}</div></div>
            <div className="info-row"><span>✅</span><div className="info-label">Attendance</div><div className="info-val">{att?`${att.percentage}%`:"Loading..."}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => { apiFetch("/announcements",token).then(setData).catch(()=>setData([])); }, [token]);
  const BADGE = { New:{bg:"#FFF0E8",c:"#FA9058"}, Info:{bg:"#E8F4FF",c:"#4285F4"}, Urgent:{bg:"#FFFBE8",c:"#C9960A"} };
  return (
    <div className="page">
      <div className="page-header"><div><h2>📢 Announcements</h2><p>School and class updates</p></div></div>
      <div className="card">
        {!data ? <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p> :
         data.length===0 ? <EmptyState icon="📢" title="No announcements yet" sub="When your school posts announcements they will appear here."/> :
         data.map(a=>{ const b=BADGE[a.badge_type]||BADGE.Info; return(
          <div key={a.announcement_id} className="ann-item">
            <div className="ann-dot" style={{background:b.c}}/>
            <div style={{flex:1}}>
              <div className="ann-title">{a.title}</div>
              <div className="ann-desc">{a.description}</div>
              <div className="ann-meta">📌 {new Date(a.date_posted).toLocaleDateString()} · {a.author}</div>
            </div>
            <span className="ann-badge" style={{background:b.bg,color:b.c}}>{a.badge_type}</span>
          </div>
        );})}
      </div>
    </div>
  );
}

function SchedulePage() {
  const { token } = useAuth();
  const [day,setDay] = useState(DAYS[new Date().getDay()]||"Sunday");
  const [data,setData] = useState(null);
  useEffect(()=>{ setData(null); apiFetch(`/schedule?day=${day}`,token).then(setData).catch(()=>setData([])); },[token,day]);
  return (
    <div className="page">
      <div className="page-header"><div><h2>📅 Weekly Schedule</h2><p>Your class timetable</p></div></div>
      <div className="card">
        <div className="day-tabs">{DAYS.map(d=><button key={d} className={"day-tab"+(day===d?" active":"")} onClick={()=>setDay(d)}>{d}</button>)}</div>
        {!data ? <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p> :
         data.length===0 ? <EmptyState icon="📅" title="No classes this day" sub="Enjoy your day off!"/> :
         data.map((s,i)=>(
          <div key={s.schedule_id} className="period-item">
            <div className="period-time">{fmt(s.start_time)} – {fmt(s.end_time)}</div>
            <div className="period-bar" style={{background:COLORS[i%COLORS.length]}}/>
            <div className="period-info"><div className="period-subject">{s.class_name}</div><div className="period-teacher-name">{s.teacher_name}</div></div>
            <div className="period-room">{s.room_number}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesPage() {
  const { token } = useAuth();
  const [data,setData] = useState(null);
  useEffect(()=>{ apiFetch("/courses",token).then(setData).catch(()=>setData([])); },[token]);
  return (
    <div className="page">
      <div className="page-header"><div><h2>📚 My Courses</h2><p>All enrolled subjects this semester</p></div></div>
      {!data ? <p style={{color:"var(--text-light)",fontSize:13,padding:20}}>Loading...</p> :
       data.length===0 ? <div className="card"><EmptyState icon="📚" title="No courses found" sub="Your enrolled courses will appear here."/></div> :
       <div className="grid-eq3">
        {data.map((c,i)=>{ const s=COURSE_STYLES[i%COURSE_STYLES.length]; return(
          <div key={c.class_number} className="course-card">
            <div className="course-card-head">
              <div className="course-card-icon" style={{background:s.bg}}>{s.icon}</div>
              <div><div style={{fontFamily:"Baloo 2,cursive",fontSize:16,fontWeight:700}}>{c.class_name}</div><div style={{fontSize:12,color:"var(--text-mid)"}}>{c.teacher_name}</div></div>
            </div>
            <div className="course-card-stats">
              <div className="course-stat"><div className="course-stat-val">{c.number_of_students}</div><div className="course-stat-lbl">Students</div></div>
              <div className="course-stat"><div className="course-stat-val">G{c.grade}</div><div className="course-stat-lbl">Level</div></div>
            </div>
          </div>
        );})}
      </div>}
    </div>
  );
}

function AssignmentsPage() {
  const { token } = useAuth();
  const [tab,setTab] = useState("All");
  const [data,setData] = useState(null);
  useEffect(()=>{ apiFetch("/assignments",token).then(setData).catch(()=>setData([])); },[token]);
  const today = new Date();
  const filtered = data?.filter(a => tab==="All" || (tab==="Upcoming" && new Date(a.due_date)>=today) || (tab==="Past" && new Date(a.due_date)<today));
  return (
    <div className="page">
      <div className="page-header"><div><h2>📝 Assignments</h2><p>Your homework and tasks</p></div></div>
      <div className="inner-tabs">{["All","Upcoming","Past"].map(t=><button key={t} className={"inner-tab"+(tab===t?" active":"")} onClick={()=>setTab(t)}>{t}</button>)}</div>
      <div className="card">
        {!data ? <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p> :
         !filtered?.length ? <EmptyState icon="📝" title="No assignments found" sub="Assignments from your teachers will appear here."/> :
         filtered.map(a=>{
          const due=new Date(a.due_date); const isPast=due<today; const dLeft=Math.ceil((due-today)/(1000*60*60*24));
          return(
            <div key={a.assignment_id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:"1px solid #F5EDE6"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:isPast?"#F0E8E0":"#FFF0E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{isPast?"✓":"📝"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>{a.title}</div>
                <div style={{fontSize:11,color:"var(--text-mid)",marginTop:2}}>{a.class_name} · {a.teacher_name}</div>
                <div style={{fontSize:11,color:"var(--text-light)",marginTop:2}}>{a.description}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:isPast?"#F0E8E0":dLeft<=2?"#FFF0E8":"#E8FBF0",color:isPast?"var(--text-light)":dLeft<=2?"#FA9058":"#34A853"}}>
                  {isPast?"Past due":dLeft===0?"Due today!":dLeft===1?"Tomorrow":`${dLeft}d left`}
                </div>
                <div style={{fontSize:11,color:"var(--text-light)",marginTop:4}}>Max: {a.max_score} pts</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GradesPage() {
  const { token } = useAuth();
  const [tab,setTab] = useState("By Subject");
  const [data,setData] = useState(null);
  useEffect(()=>{ apiFetch("/grades",token).then(setData).catch(()=>setData([])); },[token]);
  const bySubject = data?.reduce((acc,g)=>{ if(!acc[g.class_name]) acc[g.class_name]=[]; acc[g.class_name].push(g); return acc; },{});
  return (
    <div className="page">
      <div className="page-header"><div><h2>🏆 Grades</h2><p>Your academic performance</p></div></div>
      <div className="inner-tabs">{["By Subject","By Assignment"].map(t=><button key={t} className={"inner-tab"+(tab===t?" active":"")} onClick={()=>setTab(t)}>{t}</button>)}</div>
      <div className="card">
        {!data ? <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p> :
         !data.length ? <EmptyState icon="🏆" title="No grades yet" sub="Your grades will appear here once your teacher enters them."/> :
         tab==="By Subject" ?
          Object.entries(bySubject||{}).map(([subj,gs])=>{
            const avg=Math.round(gs.reduce((s,g)=>s+(g.score/g.max_score)*100,0)/gs.length);
            return(
              <div key={subj} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F5EDE6"}}>
                <div style={{width:38,height:38,borderRadius:10,background:"#FFF0E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📚</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{subj}</div>
                  <div className="grade-bar-wrap"><div className="grade-bar" style={{width:`${avg}%`,background:"#FA9058"}}/></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"Baloo 2,cursive",fontSize:18,fontWeight:800}}>{avg}%</div>
                  <div style={{fontSize:10,color:"var(--text-light)"}}>{gs.length} grade(s)</div>
                </div>
              </div>
            );
          }) :
          data.map(g=>(
            <div key={g.grade_id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F5EDE6"}}>
              <div style={{width:38,height:38,borderRadius:10,background:"#E8FBF0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✅</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>{g.title}</div>
                <div style={{fontSize:11,color:"var(--text-mid)"}}>{g.class_name} · {new Date(g.submitted_at).toLocaleDateString()}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Baloo 2,cursive",fontSize:18,fontWeight:800,color:"#FA9058"}}>{g.score}/{g.max_score}</div>
                <div style={{fontSize:10,color:"var(--text-light)"}}>{Math.round((g.score/g.max_score)*100)}%</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function AttendancePage() {
  const { token } = useAuth();
  const [data,setData] = useState(null);
  useEffect(()=>{ apiFetch("/attendance",token).then(setData).catch(()=>setData(null)); },[token]);
  const sum=data?.summary; const recs=data?.records;
  return (
    <div className="page">
      <div className="page-header"><div><h2>✅ Attendance</h2><p>Your presence and absence history</p></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {[["green","✅","Days Present",sum?.present],["orange","❌","Days Absent",sum?.absent],["yellow","⏰","Days Late",sum?.late]].map(([c,ic,l,v])=>(
          <div key={l} className={`stat-card ${c}`}><div className="stat-icon">{ic}</div><div className="stat-value">{data?v:"—"}</div><div className="stat-label">{l}</div><div className="stat-sub">{sum?`Out of ${sum.total} days`:"Loading..."}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">📆 Attendance Records</div></div>
        {!data ? <p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p> :
         !recs?.length ? <EmptyState icon="📆" title="No records yet" sub="Your daily attendance will appear here."/> :
         recs.map(r=>(
          <div key={r.attendance_id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F5EDE6"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:STATUS_COLOR[r.status],flexShrink:0}}/>
            <div style={{flex:1,fontSize:13,fontWeight:600}}>{new Date(r.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
            <span style={{fontSize:11,fontWeight:800,padding:"3px 10px",borderRadius:20,background:STATUS_COLOR[r.status]+"22",color:STATUS_COLOR[r.status],textTransform:"capitalize"}}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesPage() {
  const { token } = useAuth();
  const [teachers,setTeachers] = useState([]);
  const [messages,setMessages] = useState([]);
  const [selected,setSelected] = useState(null);
  const [msg,setMsg] = useState("");
  const [sending,setSending] = useState(false);

  useEffect(()=>{
    apiFetch("/courses",token).then(setTeachers).catch(()=>{});
    apiFetch("/messages",token).then(setMessages).catch(()=>{});
  },[token]);

  const convo = messages.filter(m=>m.teacher_name===selected?.teacher_name);

  const send = async () => {
    if (!msg.trim()||!selected) return;
    setSending(true);
    try {
      await apiFetch("/messages",token,{ method:"POST", body:JSON.stringify({receiver_id:selected.teacher_id,content:msg}) });
      setMsg("");
      apiFetch("/messages",token).then(setMessages).catch(()=>{});
    } catch {}
    setSending(false);
  };

  return (
    <div className="page">
      <div className="page-header"><div><h2>💬 Messages</h2><p>Talk to your teachers</p></div></div>
      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:20,minHeight:400}}>
        <div className="card" style={{overflow:"auto"}}>
          <div className="card-title" style={{fontSize:15,marginBottom:14}}>Teachers</div>
          {teachers.map(t=>(
            <div key={t.class_number} onClick={()=>setSelected(t)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 8px",borderRadius:10,cursor:"pointer",background:selected?.class_number===t.class_number?"var(--apricot)":"transparent",marginBottom:4}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,var(--azure),var(--apogyan))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,flexShrink:0}}>
                {t.teacher_name.split(" ").slice(1).map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{t.teacher_name}</div>
                <div style={{fontSize:11,color:"var(--text-light)"}}>{t.class_name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{display:"flex",flexDirection:"column"}}>
          {!selected ? <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><EmptyState icon="💬" title="Select a teacher" sub="Choose a teacher from the left to start messaging."/></div> : (
            <>
              <div className="card-title" style={{marginBottom:16}}>💬 {selected.teacher_name}</div>
              <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:16,minHeight:200}}>
                {convo.length===0 ? <p style={{color:"var(--text-light)",fontSize:13}}>No messages yet. Start the conversation!</p> :
                 convo.map(m=>(
                  <div key={m.message_id} style={{background:"var(--apricot)",borderRadius:12,padding:"10px 14px",alignSelf:"flex-start",maxWidth:"80%"}}>
                    <div style={{fontSize:13}}>{m.content}</div>
                    <div style={{fontSize:10,color:"var(--text-light)",marginTop:4}}>{new Date(m.sent_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
                  placeholder="Type a message..." style={{flex:1,padding:"10px 14px",borderRadius:12,border:"2px solid #F5EDE6",fontSize:13,fontFamily:"Nunito,sans-serif",outline:"none"}}/>
                <button onClick={send} disabled={sending} style={{padding:"10px 18px",background:"var(--orange)",color:"white",border:"none",borderRadius:12,fontWeight:700,cursor:"pointer",fontFamily:"Nunito,sans-serif"}}>
                  {sending?"...":"Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { token, user: authUser } = useAuth();
  const [data,setData] = useState(null);
  useEffect(()=>{ apiFetch("/student/me",token).then(setData).catch(()=>setData(null)); },[token]);
  const s=data?.student; const p=data?.parent; const cls=data?.classes;
  const Field=({label,value,full})=>(
    <div className={"p-field"+(full?" p-full":"")}><div className="p-field-label">{label}</div><div className="p-field-val">{value||"—"}</div></div>
  );
  return (
    <div className="page">
      <div className="page-header"><div><h2>👤 My Profile</h2><p>Student and parent information</p></div></div>
      <div className="profile-hero">
        <div className="profile-avatar">👧</div>
        <div>
          <div className="profile-name">{authUser?.firstName} {authUser?.lastName}</div>
          <div className="profile-chips">
            <span className="profile-chip">Grade {authUser?.grade}</span>
            <span className="profile-chip">ID: {authUser?.username}</span>
          </div>
        </div>
      </div>
      <div className="grid-eq2">
        <div className="card">
          <div className="card-header"><div className="card-title">🎓 Student Info</div></div>
          {!data?<p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p>:(
            <div className="p-field-grid">
              <Field label="First Name" value={s?.first_name}/>
              <Field label="Last Name" value={s?.last_name}/>
              <Field label="Username" value={s?.username}/>
              <Field label="Date of Birth" value={s?.date_of_birth?.split("T")[0]}/>
              <Field label="Grade" value={s?.grade}/>
              <Field label="Phone Number" value={s?.phone_number}/>
              <Field label="Address" value={s?.address} full/>
              <Field label="Medical Condition" value={s?.medical_condition} full/>
            </div>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div className="card">
            <div className="card-header"><div className="card-title">👨‍👩‍👧 Parent Info</div></div>
            {!data?<p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p>:(
              <div className="p-field-grid">
                <Field label="Parent Name" value={p?.parent_name} full/>
                <Field label="Phone Number" value={p?.phone_number}/>
                <Field label="Date of Birth" value={p?.date_of_birth?.split("T")[0]}/>
                <Field label="School Employee" value={p?.employee?"Yes":"No"} full/>
              </div>
            )}
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">🏫 Classes</div></div>
            {!cls?<p style={{color:"var(--text-light)",fontSize:13}}>Loading...</p>:
             cls.map(c=>(
              <div key={c.class_number} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F5EDE6",fontSize:13}}>
                <span style={{fontWeight:700}}>{c.class_name}</span>
                <span style={{color:"var(--text-mid)"}}>{c.teacher_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN STUDENT DASHBOARD ──
const PAGES = {
  dashboard: DashboardPage, announcements: AnnouncementsPage,
  schedule: SchedulePage, courses: CoursesPage,
  assignments: AssignmentsPage, grades: GradesPage,
  attendance: AttendancePage, messages: MessagesPage, profile: ProfilePage,
  groupchat: GroupChatPage,
};

export default function StudentDashboard() {
  const { logout } = useAuth();
  const [page, setPage] = useState("dashboard");
  const Page = PAGES[page] || DashboardPage;
  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={p=>{ setPage(p); }} onLogout={logout}/>
      <main className="main-content">
        <Page key={page} onNavigate={setPage}/>
      </main>
    </div>
  );
}
function GroupChatPage() {
  const { token, user } = useAuth();
  const grade = user?.grade;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const load = () => {
    fetch(`${API}/groupchat`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMessages(data); })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [token]);

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
        body: JSON.stringify({ content: input.trim() }),
      });
      const data = await res.json();
      if (data.success) { setInput(''); load(); }
    } catch {}
    setSending(false);
  };

  const gradeNames = { 1:'KG1', 2:'KG2', 3:'KG3' };
  const gradeName = gradeNames[grade] || `Grade ${grade}`;

  const myName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() + ' (Parent)';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>👨‍👩‍👧 {gradeName} Parents Group</h2>
          <p>Group chat with your child's teachers</p>
        </div>
      </div>

      <div className="card" style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 240px)', minHeight:400 }}>
        {/* Group header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:14, borderBottom:'1px solid #F5EDE6', marginBottom:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,var(--azure),var(--apogyan))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>👨‍👩‍👧</div>
          <div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:700 }}>{gradeName} — Parents & Teachers Group</div>
            <div style={{ fontSize:12, color:'var(--text-light)' }}>Messages are visible to all teachers and parents in {gradeName}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingBottom:8 }}>
          {messages.length === 0 ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--text-light)', gap:12, padding:40 }}>
              <div style={{ fontSize:48, opacity:0.35 }}>💬</div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:700, color:'var(--text-mid)' }}>No messages yet</div>
              <div style={{ fontSize:13 }}>Be the first to send a message!</div>
            </div>
          ) : messages.map(m => {
            const isMe = m.sender_type === 'student';
            const isTeacher = m.sender_type === 'teacher';
            return (
              <div key={m.message_id} style={{ display:'flex', flexDirection:'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom:6 }}>
                <div style={{ fontSize:11, color:'var(--text-light)', marginBottom:3, padding:'0 4px', display:'flex', alignItems:'center', gap:6 }}>
                  {isTeacher && <span style={{ background:'#FFF0E8', color:'var(--orange)', fontSize:10, fontWeight:800, padding:'2px 6px', borderRadius:10 }}>Teacher</span>}
                  {m.sender_name}
                </div>
                <div style={{
                  background: isMe ? 'linear-gradient(135deg,var(--orange),#f97040)' : isTeacher ? 'linear-gradient(135deg,var(--apogyan),var(--azure))' : 'var(--apricot)',
                  color: (isMe || isTeacher) ? 'white' : 'var(--text-dark)',
                  padding:'10px 14px',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize:13, maxWidth:'75%', lineHeight:1.5
                }}>{m.content}</div>
                <div style={{ fontSize:10, color:'var(--text-light)', marginTop:3, padding:'0 4px' }}>
                  {new Date(m.sent_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid #F5EDE6' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type a message…"
            style={{ flex:1, padding:'10px 16px', borderRadius:30, border:'2px solid #F5EDE6', fontFamily:"'Nunito',sans-serif", fontSize:13, outline:'none' }}
          />
          <button onClick={send} disabled={sending} style={{
            width:44, height:44, borderRadius:'50%',
            background: sending ? '#ccc' : 'linear-gradient(135deg,var(--orange),#f97040)',
            border:'none', color:'white', fontSize:18, cursor: sending ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
          }}>➤</button>
        </div>
      </div>
    </div>
  );
}


