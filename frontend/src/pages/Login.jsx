import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role,    setRole]    = useState("student");
  const [user,    setUser]    = useState("");
  const [pass,    setPass]    = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!user || !pass) { setError("Please enter your username and password."); return; }
    setError(""); setLoading(true);
    try {
      const data = await loginUser(user, pass);
      if (data.error) { setError(data.error); setLoading(false); return; }
      login(data.token, data.user, data.role);
      if (data.role === "teacher")      navigate("/teacher");
      else if (data.role === "student") navigate("/student");
      else if (data.role === "admin")   navigate("/admin");
    } catch { setError("Cannot connect to server. Make sure the backend is running."); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logo.svg" alt="Kiddo" style={{ height:56, marginBottom:8 }} />
        <p className="auth-subtitle">Smart Kindergarten Platform</p>
        <h2 className="auth-title">Welcome Back! 👋</h2>

        {/* Role tabs */}
        <div className="auth-role-tabs">
          {[["student","🧒 Student"],["teacher","👩\u200d🏫 Teacher"],["admin","👑 Admin"]].map(([k,l]) => (
            <button key={k} className={"auth-role-tab"+(role===k?" active":"")} onClick={() => { setRole(k); setError(""); }}>{l}</button>
          ))}
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label className="auth-label">{role==="student" ? "Student Username" : role==="teacher" ? "Teacher ID" : "Admin Username"}</label>
          <input className="auth-input" type="text"
            placeholder="Enter your username"
            value={user} onChange={e => setUser(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="pw-wrap">
            <input className="auth-input" type={showPw?"text":"password"} placeholder="••••••••"
              value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()}
              style={{ paddingRight:44 }} />
            <button className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw?"👁️":"👁️\u200d🗨️"}</button>
          </div>
        </div>

        <div style={{ textAlign:"right", marginBottom:20 }}>
          <span style={{ fontSize:13, color:"#A855F7", fontWeight:700, cursor:"pointer" }}>Forgot password?</span>
        </div>

        <button className="auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login 🚀"}
        </button>

        <p style={{ marginTop:20, fontSize:14, color:"var(--text-mid)" }}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} style={{ color:"var(--orange)", fontWeight:700, cursor:"pointer" }}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
