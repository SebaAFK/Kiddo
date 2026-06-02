const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export async function loginUser(username, password) {
  const res = await fetch(BASE+'/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password}) });
  return res.json();
}
export async function signupUser(data) {
  const res = await fetch(BASE+'/auth/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  return res.json();
}
export async function apiFetch(endpoint, token, options={}) {
  const res = await fetch(BASE+endpoint, { ...options, headers:{'Content-Type':'application/json',Authorization:'Bearer '+token,...(options.headers||{})} });
  return res.json();
}
