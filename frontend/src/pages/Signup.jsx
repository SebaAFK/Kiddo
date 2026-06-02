import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", password:"", confirmPassword:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [showCp,  setShowCp]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSignup = async () => {
    setError(""); setSuccess("");
    if (!form.firstName||!form.lastName||!form.email||!form.phone||!form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const data = await signupUser({...form, role});
      if (data.error) { setError(data.error); }
      else { setSuccess("Account created! Redirecting to login..."); setTimeout(() => navigate("/login"), 2000); }
    } catch { setError("Cannot connect to server. Make sure the backend is running."); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth:480 }}>
        <img src="/logo.svg" alt="Kiddo" style={{ height:56, marginBottom:8 }} />
        <p className="auth-subtitle">Smart Kindergarten Platform</p>
        <h2 className="auth-title">Create an Account 🌟</h2>

        <div className="auth-role-tabs">
          {[["student","🧒 Student"],["teacher","👩\u200d🏫 Teacher"]].map(([k,l]) => (
            <button key={k} className={"auth-role-tab"+(role===k?" active":"")} onClick={() => setRole(k)}>{l}</button>
          ))}
        </div>

        {error   && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <div className="auth-field" style={{ margin:0 }}>
            <label className="auth-label">First Name</label>
            <input className="auth-input" type="text" placeholder="Sara" value={form.firstName} onChange={e => set("firstName",e.target.value)} />
          </div>
          <div className="auth-field" style={{ margin:0 }}>
            <label className="auth-label">Last Name</label>
            <input className="auth-input" type="text" placeholder="Ahmed" value={form.lastName} onChange={e => set("lastName",e.target.value)} />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" placeholder="example@email.com" value={form.email} onChange={e => set("email",e.target.value)} />
        </div>

        <div className="auth-field">
          <label className="auth-label">Phone Number</label>
          <input className="auth-input" type="tel" placeholder="05xxxxxxxx" value={form.phone} onChange={e => set("phone",e.target.value)} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
          <div className="auth-field" style={{ margin:0 }}>
            <label className="auth-label">Password</label>
            <div className="pw-wrap">
              <input className="auth-input" type={showPw?"text":"password"} placeholder="••••••••" value={form.password} onChange={e => set("password",e.target.value)} style={{ paddingRight:40 }} />
              <button className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw?"👁️":"👁️\u200d🗨️"}</button>
            </div>
          </div>
          <div className="auth-field" style={{ margin:0 }}>
            <label className="auth-label">Confirm Password</label>
            <div className="pw-wrap">
              <input className="auth-input" type={showCp?"text":"password"} placeholder="••••••••" value={form.confirmPassword} onChange={e => set("confirmPassword",e.target.value)} style={{ paddingRight:40 }} />
              <button className="pw-toggle" onClick={() => setShowCp(!showCp)}>{showCp?"👁️":"👁️\u200d🗨️"}</button>
            </div>
          </div>
        </div>

        <button className="auth-btn" onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Create Account ✨"}
        </button>

        <p style={{ marginTop:20, fontSize:14, color:"var(--text-mid)" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={{ color:"var(--orange)", fontWeight:700, cursor:"pointer" }}>Login</span>
        </p>
      </div>
    </div>
  );
}
