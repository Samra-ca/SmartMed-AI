/* ── AUTH ── */
const saveUser = (token, user) => {
  localStorage.setItem('sdc_token', token);
  localStorage.setItem('sdc_user', JSON.stringify(user));
};

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('sdc_user')); }
  catch { return null; }
};

const getToken = () => localStorage.getItem('sdc_token');

const logout = () => {
  localStorage.removeItem('sdc_token');
  localStorage.removeItem('sdc_user');
  const p = window.location.pathname.includes('/pages/');
  window.location.href = p ? '../index.html' : 'index.html';
};

const requireAuth = (role) => {
  const u = getUser();
  if (!u || !getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  if (role && u.role !== role) {
    window.location.href = u.role === 'doctor'
      ? 'doctor-dashboard.html'
      : 'patient-dashboard.html';
    return false;
  }
  return true;
};

/* ── API ── */
const BASE = 'https://samra-fa-smart-med-ai-backend.hf.space/api';

const ah = () => ({
  'Content-Type':  'application/json',
  'Authorization': `Bearer ${getToken()}`
});

const api = {
  register: d => fetch(`${BASE}/auth/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(d)
  }).then(r => r.json()),

  login: d => fetch(`${BASE}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(d)
  }).then(r => r.json()),

  searchDoctors: (q = '', city = '') =>
    fetch(`${BASE}/doctors/search?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`)
    .then(r => r.json()),

  getDoctorById: id =>
    fetch(`${BASE}/doctors/${id}`).then(r => r.json()),

  getMyProfile: () =>
    fetch(`${BASE}/doctors/me`, { headers: ah() }).then(r => r.json()),

  createProfile: fd => fetch(`${BASE}/doctors/profile`, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body:    fd
  }).then(r => r.json()),

  toggleAvailability: () => fetch(`${BASE}/doctors/availability`, {
    method:  'PATCH',
    headers: ah()
  }).then(r => r.json()),

  bookAppointment: d => fetch(`${BASE}/appointments`, {
    method:  'POST',
    headers: ah(),
    body:    JSON.stringify(d)
  }).then(r => r.json()),

  getPatientAppointments: () =>
    fetch(`${BASE}/appointments/patient`, { headers: ah() }).then(r => r.json()),

  getDoctorAppointments: () =>
    fetch(`${BASE}/appointments/doctor`, { headers: ah() }).then(r => r.json()),

  updateAppointmentStatus: (id, status) => fetch(`${BASE}/appointments/${id}`, {
    method:  'PATCH',
    headers: ah(),
    body:    JSON.stringify({ status })
  }).then(r => r.json()),

  sendMessage: d => fetch(`${BASE}/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(d)
  }).then(r => r.json()),

  getDoctorMessages: () =>
    fetch(`${BASE}/chat/messages`, { headers: ah() }).then(r => r.json()),
};

/* ── TOAST ── */
const toast = (msg, type = 'inf', ms = 3500) => {
  let c = document.getElementById('_toasts');
  if (!c) {
    c = document.createElement('div');
    c.id        = '_toasts';
    c.className = 'toasts';
    document.body.appendChild(c);
  }
  const icons = { ok: '✅', err: '❌', inf: 'ℹ️', wrn: '⚠️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(el);
  setTimeout(() => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(110%)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }, ms);
};

/* ── showToast alias (same as toast) ── */
const showToast = (msg, type = 'info', ms = 3500) => {
  const map = { success: 'ok', error: 'err', info: 'inf', warning: 'wrn' };
  toast(msg, map[type] || 'inf', ms);
};

/* ── NAV ── */
const setupNav = () => {
  const u = getUser();
  ['nav-login', 'nav-register'].forEach(id => {
    const el = document.getElementById(id);
    if (el && u) el.style.display = 'none';
  });
  const nl = document.getElementById('nav-logout');
  if (nl && u) nl.style.display = 'list-item';
  const np = document.getElementById('nav-patient');
  if (np && u && u.role === 'patient') np.style.display = 'list-item';
  const nd = document.getElementById('nav-doctor');
  if (nd && u && u.role === 'doctor') nd.style.display = 'list-item';
  const nu = document.getElementById('nav-user');
  if (nu && u) nu.innerHTML = `
    <div class="nav-chip">
      <div class="nav-chip-avatar">${u.name.charAt(0).toUpperCase()}</div>
      <span>${u.name.split(' ')[0]}</span>
    </div>`;
};

/* ── HELPERS ── */
const ava = (name, pic) => pic
  ? `https://samra-fa-smart-med-ai-backend.hf.space/uploads/${pic}`
  : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1447E6&color=fff&bold=true&size=200`;
  
const stars = (r = 0, m = 5) => {
  const n = Math.round(r);
  return '★'.repeat(n) + '☆'.repeat(m - n);
};

const fmtDate = s => {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const nowTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });