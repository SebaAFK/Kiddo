import { useAuth } from "../context/AuthContext";

const NAV = [
  { section: "DASHBOARD" },
  { id: "dashboard",     label: "Overview",     icon: "📊" },
  { section: "MANAGEMENT" },
  { id: "announcements", label: "Announcements", icon: "📢" },
  { id: "register",      label: "Register",      icon: "➕" },
  { section: "TEACHERS" },
  { id: "chat",          label: "Teacher Chat",  icon: "💬" },
  { id: "attendance",    label: "Attendance",    icon: "✅" },
  { id: "kpi",           label: "Teacher KPI",   icon: "🏆" },
  { section: "ACCOUNT" },
  { id: "logout",        label: "Log out",       icon: "🚪", isLogout: true },
];

export default function AdminSidebar({ activePage, onNavigate, onLogout }) {
  const { user } = useAuth();

  return (
    <aside style={{ width:"var(--sidebar-w)", minHeight:"100vh", background:"#3D2B1F", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", left:0, top:0, bottom:0, zIndex:100 }}>
      {/* Logo */}
      <div style={{ padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:10 }}>
        <svg width="26" height="42" viewBox="0 0 32 52" fill="none">
          <rect x="8" y="6" width="16" height="36" rx="3" fill="#FECC64"/>
          <rect x="8" y="6" width="16" height="8" rx="3" fill="#E8453C"/>
          <rect x="6" y="6" width="20" height="3" rx="1.5" fill="#FFC0C0"/>
          <path d="M8 42 L16 52 L24 42 Z" fill="#FA9058"/>
          <rect x="12" y="10" width="8" height="32" rx="2" fill="#FFD97A"/>
        </svg>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800 }}>
          <span style={{ color:"#E8453C" }}>K</span><span style={{ color:"#FECC64" }}>i</span>
          <span style={{ color:"#5BCC8A" }}>d</span><span style={{ color:"#95CAFC" }}>d</span>
          <span style={{ color:"#B59BFF" }}>o</span>
        </div>
      </div>

      {/* Admin badge */}
      <div style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ background:"rgba(250,144,88,0.2)", borderRadius:10, padding:"8px 12px", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--orange)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"white" }}>
            {(user?.firstName?.[0]||"A")+(user?.lastName?.[0]||"D")}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"white" }}>{user?.admin_name||"Admin"}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>System Control</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding:"12px", flex:1 }}>
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} style={{ fontSize:10, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,0.3)", padding:"12px 10px 6px" }}>{item.section}</div>
          ) : (
            <button key={item.id}
              onClick={() => item.isLogout ? onLogout() : onNavigate(item.id)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 14px", borderRadius:12, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'Nunito',sans-serif", marginBottom:2, transition:"all 0.2s",
                background: activePage===item.id ? "var(--orange)" : "transparent",
                color: activePage===item.id ? "white" : item.isLogout ? "rgba(255,100,100,0.8)" : "rgba(255,255,255,0.7)",
                boxShadow: activePage===item.id ? "0 4px 14px rgba(250,144,88,0.3)" : "none",
              }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        )}
      </nav>
    </aside>
  );
}
