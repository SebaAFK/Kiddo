import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily:"Nunito,sans-serif" }}>
      {/* Navbar */}
      <nav className="home-nav">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="/logo.svg" alt="Kiddo" style={{ height:40 }} />
        </div>
        <div className="home-nav-btns">
          <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
          
        </div>
      </nav>

      {/* Hero */}
      <section className="home-hero">
        <div>
          <span className="hero-emoji">🎒</span>
          <h1 className="hero-title">Smart School Management<br/>for <span>Kindergartens</span></h1>
          <p className="hero-sub">Kiddo connects teachers and parents through a secure, easy-to-use platform — keeping everyone informed and engaged in every child's journey.</p>
          <div className="hero-btns">
            <button className="hero-btn-primary" onClick={() => navigate("/login")}>Get Started 🚀</button>
            
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="features-title">Why Kiddo? 🌟</h2>
        <div className="features-grid">
          {[
            { icon:"📢", title:"Real-time Announcements", desc:"Teachers post updates instantly. Parents stay informed about everything happening in school." },
            { icon:"📅", title:"Weekly Schedules", desc:"View class timetables, upcoming events, and important dates all in one place." },
            { icon:"📊", title:"Academic Tracking", desc:"Monitor grades, attendance, and assignments — full visibility into your child's progress." },
            { icon:"💬", title:"Direct Messaging", desc:"Parents and teachers communicate directly through a safe, monitored messaging system." },
            { icon:"✅", title:"Attendance Monitoring", desc:"Track your child's daily attendance with detailed records and monthly summaries." },
            { icon:"🔒", title:"Safe & Secure", desc:"All data is protected with secure authentication and role-based access control." },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"var(--text-dark)", color:"rgba(255,255,255,0.6)", textAlign:"center", padding:"28px", fontFamily:"Nunito,sans-serif", fontSize:13 }}>
        © 2026 Kiddo School Management System. Built with ❤️ for kindergartens.
      </footer>
    </div>
  );
}
