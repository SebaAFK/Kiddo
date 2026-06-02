import { useAuth } from "../context/AuthContext";

const STUDENT_NAV = [
  { section:"Overview" },
  { id:"dashboard",     label:"Dashboard",     icon:"🏠" },
  { id:"announcements", label:"Announcements",  icon:"📢" },
  { section:"Academics" },
  { id:"schedule",      label:"Schedule",       icon:"📅" },
  { id:"courses",       label:"Courses",        icon:"📚" },
  { id:"assignments",   label:"Assignments",    icon:"📝" },
  { id:"grades",        label:"Grades",         icon:"🏆" },
  { section:"School Life" },
  { id:"attendance",    label:"Attendance",     icon:"✅" },
  { id:"groupchat",     label:"Parents Group",   icon:"👨‍👩‍👧" },
  { id:"profile",       label:"My Profile",     icon:"👤" },
];

const TEACHER_NAV = [
  { section:"Overview" },
  { id:"dashboard",     label:"Dashboard",     icon:"🏠" },
  { id:"announcements", label:"Announcements",  icon:"📢" },
  { section:"My Classes" },
  { id:"classes",       label:"Classes",        icon:"🏫" },
  { id:"schedule",      label:"Schedule",       icon:"📅" },
  { id:"assignments",   label:"Assignments",    icon:"📝" },
  { id:"grades",        label:"Grades",         icon:"🏆" },
  { section:"Communication" },
  { id:"parents",       label:"Parents",        icon:"👨‍👩‍👧" },
  { id:"groupchat",     label:"Parents Group",   icon:"👨‍👩‍👧" },
  { id:"profile",       label:"My Profile",     icon:"👤" },
];

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  const { user, role } = useAuth();
  const nav = role === "teacher" ? TEACHER_NAV : STUDENT_NAV;
  const initials = user ? (user.firstName?.[0]||"") + (user.lastName?.[0]||"") : "?";
  const name = user ? `${user.firstName} ${user.lastName}` : "User";
  const sub  = role === "teacher" ? "Teacher" : `Grade ${user?.grade || ""} · Student`;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="26" height="42" viewBox="0 0 32 52" fill="none">
          <rect x="8" y="6" width="16" height="36" rx="3" fill="#FECC64"/>
          <rect x="8" y="6" width="16" height="8" rx="3" fill="#E8453C"/>
          <rect x="6" y="6" width="20" height="3" rx="1.5" fill="#FFC0C0"/>
          <path d="M8 42 L16 52 L24 42 Z" fill="#FA9058"/>
          <rect x="12" y="10" width="8" height="32" rx="2" fill="#FFD97A"/>
        </svg>
        <div className="logo-text">
          <span className="k">K</span><span className="i">i</span><span className="d">d</span><span className="d2">d</span><span className="o">o</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {nav.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">{item.section}</div>
          ) : (
            <button key={item.id}
              className={"nav-btn" + (activePage === item.id ? " active" : "")}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">{initials}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</div>
          <div style={{ fontSize:11, color:"var(--text-light)" }}>{sub}</div>
        </div>
        <button onClick={onLogout} title="Logout"
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, opacity:0.5 }}>🚪</button>
      </div>
    </aside>
  );
}
