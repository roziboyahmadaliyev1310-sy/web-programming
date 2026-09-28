/* ─── Theme ─── */
function toggleTheme() {
  const r = document.documentElement;
  const isDark = r.dataset.theme === 'dark';
  r.dataset.theme = isDark ? 'light' : 'dark';
  document.getElementById('theme-toggle').textContent = isDark ? '🌙 Dark' : '☀️ Light';
  try { localStorage.setItem('w4-theme', r.dataset.theme); } catch(e){}
}
try {
  const s = localStorage.getItem('w4-theme');
  if (s) { document.documentElement.dataset.theme = s;
    document.getElementById('theme-toggle').textContent = s === 'dark' ? '☀️ Light' : '🌙 Dark'; }
} catch(e){}

/* ─── Sidebar ─── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ─── Progress bar ─── */
window.addEventListener('scroll', () => {
  const d = document.documentElement;
  const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
});

/* ─── Active nav link ─── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('#sidebar nav a').forEach(a => a.classList.remove('active'));
      const id = e.target.id;
      const link = document.querySelector(`#sidebar nav a[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });
document.querySelectorAll('.topic, .exercise, #exercises').forEach(s => observer.observe(s));

/* ─── Copy code ─── */
function copyCode(btn) {
  const code = btn.closest('.code-wrap').querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
}

/* ─── Sandbox runner ─── */
function runSB(id) {
  const editor = document.getElementById(id);
  const frame = document.getElementById(id + '-frame');
  if (editor && frame) frame.srcdoc = editor.value;
}
function resetSB(id) {
  const defaults = {
    'sb04': `<html><body style="font-family:system-ui;padding:20px">\n  <h2 id="msg">Original Text</h2>\n  <input id="inp" type="text" placeholder="Type new text..." style="padding:8px;font-size:16px;width:200px">\n  <button onclick="changeText()" style="padding:8px 16px;margin-left:8px;cursor:pointer">Change Text</button>\n  <script>\n    function changeText() {\n      const newText = document.getElementById('inp').value;\n      document.getElementById('msg').textContent = newText;\n    }\n  <\/script>\n</body></html>`
  };
  const editor = document.getElementById(id);
  const frame = document.getElementById(id + '-frame');
  if (editor && defaults[id]) editor.value = defaults[id];
  if (frame) frame.srcdoc = '';
}
// Auto-run sandbox on load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sb04')) runSB('sb04');
});

/* ─── Topic 02 demo ─── */
const codes = {
  '02a': `const el = document.getElementById('demo02-text');\nel.textContent = '✅ Text changed by JavaScript!';`,
  '02b': `const el = document.getElementById('demo02-text');\nel.style.color = '#1a56db';\nel.style.background = '#e0eaff';`
};

/* ─── Click counter demo ─── */
let count02 = 0;
const countBtn = document.getElementById('count-btn');
const countDisp = document.getElementById('count-display');
if (countBtn) {
  countBtn.addEventListener('click', () => {
    count02++;
    countDisp.textContent = count02;
    countDisp.style.color = count02 >= 10 ? 'var(--lime)' : 'var(--ac)';
  });
}

/* ─── classList demo ─── */
function clsAction(method, cls) {
  const box = document.getElementById('cls-box');
  box.classList[method](cls);
  const all = Array.from(box.classList);
  const list = document.getElementById('cls-list');
  list.innerHTML = all.map(c => `<span class="cls-badge ${c === 'highlighted' || c === 'rounded' || c === 'shadowed' || c === 'big' ? 'active' : ''}">${c}</span>`).join('');
  document.getElementById('cls-contains-result').textContent =
    `classList.contains('highlighted') → ${box.classList.contains('highlighted')}`;
}

/* ─── Event explorer ─── */
const eobjLog = document.getElementById('eobj-log');
let evLines = [];
function logEv(type, detail) {
  const line = document.createElement('div');
  line.className = 'ev-line';
  line.innerHTML = `<span class="ev-type">${type}</span><span class="ev-val">${detail}</span>`;
  if (eobjLog) {
    evLines.push(line);
    if (evLines.length > 5) { eobjLog.removeChild(evLines.shift()); }
    eobjLog.appendChild(line);
  }
}
document.querySelectorAll('#eobj-a,#eobj-b').forEach(btn => {
  if (btn) btn.addEventListener('click', e => logEv(`click on #${e.target.id}`, `e.target.textContent = "${e.target.textContent}"`));
});
const eobjInp = document.getElementById('eobj-inp');
if (eobjInp) eobjInp.addEventListener('keydown', e => logEv(`keydown`, `e.key = "${e.key}"`));

/* ─── preventDefault demo ─── */
const safeForm = document.getElementById('safe-form');
if (safeForm) {
  safeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('safe-inp').value;
    document.getElementById('safe-result').textContent =
      val ? `✅ Got value: "${val}" — no page reload!` : `✅ Form handled by JS — no reload!`;
  });
}

/* ─── Bubbling demo ─── */
const bvElements = [
  { id: 'bv-btn', label: '👆 Click me! (button)' },
  { id: 'bv-div', label: 'div#container' },
  { id: 'bv-body', label: 'body' },
  { id: 'bv-doc', label: 'document' },
  { id: 'bv-window', label: 'window' }
];
function startBubble() {
  const log = document.getElementById('bubble-log');
  log.textContent = '';
  bvElements.forEach((el, i) => {
    setTimeout(() => {
      const domEl = document.getElementById(el.id);
      if (domEl) {
        domEl.classList.add('lit');
        setTimeout(() => domEl.classList.remove('lit'), 400);
        const msg = document.createElement('div');
        msg.style.cssText = 'padding:1px 0;border-bottom:1px solid rgba(255,255,255,.08)';
        msg.textContent = `→ Event reached: ${el.label}`;
        log.appendChild(msg);
        log.scrollTop = log.scrollHeight;
      }
    }, i * 350);
  });
}

/* ─── Dynamic list demo ─── */
const newItemInp = document.getElementById('newitem-inp');
const demoList = document.getElementById('demo-list');
const demoCount = document.getElementById('demo-list-count');
function addDemoItem() {
  const text = newItemInp ? newItemInp.value.trim() : '';
  if (!text) return;
  const li = document.createElement('li');
  li.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surf);border:1px solid var(--brd);border-radius:6px';
  const span = document.createElement('span');
  span.textContent = text;
  const rmBtn = document.createElement('button');
  rmBtn.textContent = '✕';
  rmBtn.className = 'demo-btn red sm';
  rmBtn.onclick = () => { li.remove(); updateCount(); };
  li.appendChild(span);
  li.appendChild(rmBtn);
  if (demoList) demoList.appendChild(li);
  if (newItemInp) newItemInp.value = '';
  updateCount();
}
function updateCount() {
  if (demoList && demoCount) {
    const n = demoList.children.length;
    demoCount.textContent = `${n} item${n !== 1 ? 's' : ''}`;
  }
}
if (newItemInp) newItemInp.addEventListener('keydown', e => { if (e.key === 'Enter') addDemoItem(); });

/* ─── Remove demo ─── */
const rmList = document.getElementById('rm-list');
if (rmList) {
  rmList.addEventListener('click', (e) => {
    if (e.target.classList.contains('rm-btn')) {
      e.target.closest('.rm-item').remove();
    }
  });
}
const rmItemsHTML = `
  <li class="rm-item" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surf);border:1px solid var(--brd);border-radius:6px">
    <span>Item One</span><button class="demo-btn red sm rm-btn">✕ Remove</button>
  </li>
  <li class="rm-item" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surf);border:1px solid var(--brd);border-radius:6px">
    <span>Item Two</span><button class="demo-btn red sm rm-btn">✕ Remove</button>
  </li>
  <li class="rm-item" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surf);border:1px solid var(--brd);border-radius:6px">
    <span>Item Three</span><button class="demo-btn red sm rm-btn">✕ Remove</button>
  </li>`;
function resetRemoveDemo() {
  if (rmList) rmList.innerHTML = rmItemsHTML;
}

/* ─── Exercise runner ─── */
function runEx(id) {
  const src = document.getElementById(id + '-editor').value;
  document.getElementById(id + '-frame').srcdoc = src;
}
function toggleHint(id) {
  const h = document.getElementById(id + '-hint');
  h.style.display = h.style.display === 'block' ? 'none' : 'block';
}
function toggleSol(id) {
  const s = document.getElementById(id + '-sol');
  s.style.display = s.style.display === 'block' ? 'none' : 'block';
}
