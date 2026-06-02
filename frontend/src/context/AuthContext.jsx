import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('kiddo_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('kiddo_user') || 'null'));
  const [role, setRole] = useState(localStorage.getItem('kiddo_role'));
  const login = (t, u, r) => {
    localStorage.setItem('kiddo_token', t);
    localStorage.setItem('kiddo_user', JSON.stringify(u));
    localStorage.setItem('kiddo_role', r);
    setToken(t); setUser(u); setRole(r);
  };
  const logout = () => {
    ["kiddo_token","kiddo_user","kiddo_role"].forEach(k => localStorage.removeItem(k));
    setToken(null); setUser(null); setRole(null);
  };
  return <AuthContext.Provider value={{ token, user, role, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
