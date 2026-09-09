import React, { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker for offline and Android WebAPK installability
if (typeof window !== 'undefined') {
  registerSW({ immediate: true });
}

interface FormulaDef {
  d: string;
  i: [string, string, string, number][];
  c: (v: string[]) => { r: string; s: string };
}

export default function App() {
  useEffect(() => {
    const $ = (id: string) => document.getElementById(id);
    const DEFAULT_AI = {
      proxyUrl: 'https://gorouter-proxy.mubarak948476382.workers.dev',
      model: 'claude-opus-5-thinking',
      maxTokens: 1200,
    };

    function R(r: string, s: string) {
      return { r, s };
    }

    function esc(s: any) {
      return String(s ?? '').replace(
        /[&<>"']/g,
        (m) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
          }[m] || m),
      );
    }

    function safeJSON(k: string, f: any = []) {
      try {
        return JSON.parse(localStorage.getItem(k) || JSON.stringify(f));
      } catch (e) {
        return f;
      }
    }

    function nd(v: any) {
      return String(v ?? '')
        .trim()
        .replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)))
        .replace(/\s+/g, '');
    }

    let toastTimer: any = null;
    function toast(t: string) {
      const toastEl = $('toast');
      if (!toastEl) return;
      toastEl.textContent = t;
      toastEl.style.display = 'block';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastEl.style.display = 'none';
      }, 1800);
    }

    const F: Record<string, FormulaDef> = {
      F1: {
        d: '৩-ডিজিটের প্রথম + শেষ×2; তারপর +9। Extra ৩-ডিজিট থাকলে ধাপে দেখাবে।',
        i: [
          ['a', '৩ ডিজিট', '157', 3],
          ['b', 'Extra ৩ ডিজিট (ঐচ্ছিক)', 'ঐচ্ছিক', 3],
        ],
        c: (v) => {
          const a = v[0];
          const e = v[1] || '';
          const x = +a[0];
          const y = +a[2];
          const t = x + y + y;
          const z = (t + 9) % 10;
          return R(
            z + '-' + ((z + 1) % 10) + '-' + ((z + 2) % 10),
            `${x}+${y}+${y} = ${t}<br>${t}+9 = ${t + 9} → ${z}${e ? '<br>Extra ৩ ডিজিট: ' + e : ''}`,
          );
        },
      },
      F2: {
        d: 'প্রথম ডিজিট +7; এরপর পাওয়া ফল +4।',
        i: [['a', '৩ ডিজিট', '250', 3]],
        c: (v) => {
          const x = +v[0][0];
          const a = (x + 7) % 10;
          const b = (a + 4) % 10;
          return R(a + '-' + b, `${x}+7 = ${x + 7} → ${a}<br>${a}+4 = ${a + 4} → ${b}`);
        },
      },
      F3: {
        d: 'প্রথম ডিজিট×1 + শেষ ডিজিট×2 +5; তারপর +2।',
        i: [['a', '৩ ডিজিট', '157', 3]],
        c: (v) => {
          const x = +v[0][0];
          const y = +v[0][2];
          const t = x + y * 2 + 5;
          const a = t % 10;
          const b = (a + 2) % 10;
          return R(
            a + '-' + b,
            `${x}×1 + ${y}×2 +5 = ${t}<br>শেষ ডিজিট = ${a}<br>${a}+2 = ${a + 2} → ${b}`,
          );
        },
      },
      F4: {
        d: '৩ ডিজিটের শেষ + ২ ডিজিটের শেষ। যোগফলের শেষ ডিজিট ও অঙ্ক-যোগ।',
        i: [
          ['a', '৩ ডিজিট', '978', 3],
          ['b', '২ ডিজিট', '77', 2],
        ],
        c: (v) => {
          const x = +v[0][2];
          const y = +v[1][1];
          const t = x + y;
          const a = t % 10;
          const b =
            t >= 10
              ? String(t)
                  .split('')
                  .reduce((s, n) => s + +n, 0)
              : t;
          return R(a + '-' + b, `${x}+${y} = ${t}<br>অঙ্ক যোগ = ${b}`);
        },
      },
      F5: {
        d: 'প্রথম ৩-ডিজিটের প্রথম + দ্বিতীয় ৩-ডিজিটের শেষ। শেষ ডিজিট এবং +3।',
        i: [
          ['a', 'প্রথম ৩ ডিজিট', '461', 3],
          ['b', 'দ্বিতীয় ৩ ডিজিট', '252', 3],
        ],
        c: (v) => {
          const x = +v[0][0];
          const y = +v[1][2];
          const t = x + y;
          const a = t % 10;
          const b = (a + 3) % 10;
          return R(a + '-' + b, `${x}+${y} = ${t}<br>শেষ ডিজিট = ${a}<br>${a}+3 = ${a + 3} → ${b}`);
        },
      },
      F6: {
        d: 'প্রথম ৩-ডিজিটের মাঝের ডিজিট দুইবার + দ্বিতীয় ৩-ডিজিটের মাঝের ডিজিট; তারপর −1।',
        i: [
          ['a', 'প্রথম ৩ ডিজিট', '345', 3],
          ['b', 'দ্বিতীয় ৩ ডিজিট', '898', 3],
        ],
        c: (v) => {
          const x = +v[0][1];
          const y = +v[1][1];
          const t = x + x + y;
          const a = t % 10;
          const b = (a + 9) % 10;
          return R(a + '-' + b, `${x}+${x}+${y} = ${t}<br>শেষ ডিজিট = ${a}<br>${a}-1 = ${a - 1} → ${b}`);
        },
      },
      F7: {
        d: 'প্রথম ৩-ডিজিটের শেষ×3 + দ্বিতীয় ৩-ডিজিটের প্রথম + শেষ + ২-ডিজিটের প্রথম×3; তারপর +1।',
        i: [
          ['a', 'প্রথম ৩ ডিজিট', '811', 3],
          ['b', 'দ্বিতীয় ৩ ডিজিট', '852', 3],
          ['c', '২ ডিজিট', '50', 2],
        ],
        c: (v) => {
          const x = +v[0][2];
          const y = +v[1][0];
          const z = +v[1][2];
          const w = +v[2][0];
          const t = x * 3 + y + z + w * 3;
          const a = t % 10;
          const b = (a + 1) % 10;
          return R(
            a + '-' + b,
            `${x}×3 + ${y} + ${z} + ${w}×3 = ${t}<br>শেষ ডিজিট = ${a}<br>${a}+1 = ${a + 1} → ${b}`,
          );
        },
      },
      F8: {
        d: 'প্রথমের প্রথম + দ্বিতীয়ের শেষ + Extra → r1; প্রথমের শেষ + আলাদা ডিজিট-১ → r2; প্রথমের শেষ + আলাদা ডিজিট-২ → r3।',
        i: [
          ['a', 'প্রথম ৩ ডিজিট', '811', 3],
          ['b', 'দ্বিতীয় ৩ ডিজিট', '852', 3],
          ['e', 'Extra ডিজিট', '3', 1],
          ['x', 'আলাদা ডিজিট-১', '7', 1],
          ['y', 'আলাদা ডিজিট-২', '4', 1],
        ],
        c: (v) => {
          const a = v[0];
          const b = v[1];
          const e = +v[2];
          const x = +v[3];
          const y = +v[4];
          const s1 = +a[0] + +b[2] + e;
          const r1 = s1 % 10;
          const s2 = +a[2] + x;
          const r2 = s2 % 10;
          const s3 = +a[2] + y;
          const r3 = s3 % 10;
          return R(
            `${r1}-${r2}-${r3}`,
            `ধাপ ১: ${a[0]}+${b[2]}+${e} = ${s1} → ${r1}<br>ধাপ ২: ${a[2]}+${x} = ${s2} → ${r2}<br>ধাপ ৩: ${a[2]}+${y} = ${s3} → ${r3}`,
          );
        },
      },
      F9: {
        d: 'F9 Total — যেকোনো ৩-ডিজিটের শেষ ডিজিট নিন → +1 → যোগফলের শেষ ডিজিট → সেই ডিজিটের মান। Final Result = শেষ ডিজিট-যোগফলের শেষ ডিজিট-মান।',
        i: [['a', '৩ ডিজিট', '287', 3]],
        c: (v) => {
          const a = v[0];
          const x = +a[2];
          const s = x + 1;
          const r = s % 10;
          const m = (r + 5) % 10;
          return R(
            `${x}-${r}-${m}`,
            `৩-ডিজিট: ${a}<br>শেষ ডিজিট = ${x}<br>${x}+1 = ${s} → ${r}<br>${r} এর মান = ${m}`,
          );
        },
      },
      F10: {
        d: 'F10 Dwon Total Cut — Touch + ৩-ডিজিট Cut + ২-ডিজিট Cut। মোট কাট = Cut দুটির জোড়া সংখ্যা। মোট কাট ও Touch-এ থাকা ডিজিট বাদ দিলে যে বাইরের ডিজিটগুলো থাকে সেটিই Final Result।',
        i: [
          ['t', '৩-ডিজিট — Touch', '751', 3],
          ['c3', 'দ্বিতীয় ৩-ডিজিট — Cut', '495', 3],
          ['c2', '২-ডিজিট — Cut', '62', 2],
        ],
        c: (v) => {
          const t = v[0];
          const c3 = v[1];
          const c2 = v[2];
          const total = c3 + c2;
          const used = new Set((total + t).split(''));
          const m: string[] = [];
          for (let d = 0; d <= 9; d++) {
            if (!used.has(String(d))) m.push(String(d));
          }
          if (m[0] === '0' && m.length > 1) {
            const first = m.shift();
            if (first !== undefined) m.push(first);
          }
          const r = m.join('');
          return R(
            r || '—',
            `Touch: ${t}<br>${c3} Cut + ${c2} Cut = মোট কাট: ${total}<br>Touch + মোট কাট-এর ব্যবহৃত ডিজিট: ${[...used].join(', ')}<br>বাইরের ডিজিট = ${r || 'কোনোটি নেই'}`,
          );
        },
      },
    };

    let cur = 'F1';
    let editId: any = null;
    let noteId: any = null;
    let folder: any = null;
    let chat: any[] = [];

    function ai() {
      return Object.assign({}, DEFAULT_AI, safeJSON('AI_CONFIG', {}));
    }

    function saveAI(x: any) {
      localStorage.setItem('AI_CONFIG', JSON.stringify(x));
    }

    function initF() {
      const fsEl = $('fs') as HTMLSelectElement | null;
      const hsEl = $('hs') as HTMLSelectElement | null;
      const flEl = $('fl');
      if (fsEl) fsEl.innerHTML = Object.keys(F).map((k) => `<option>${k}</option>`).join('');
      if (hsEl) hsEl.innerHTML = Object.keys(F).map((k) => `<option>${k}</option>`).join('');
      if (flEl)
        flEl.innerHTML = Object.keys(F)
          .map((k) => `<div class="formula"><b>${k}</b> — ${F[k].d}</div>`)
          .join('');
      loadF();
    }

    function loadF() {
      const fsEl = $('fs') as HTMLSelectElement | null;
      cur = fsEl?.value || 'F1';
      const f = F[cur];
      const fdEl = $('fd');
      const insEl = $('ins');
      const outEl = $('out');
      if (fdEl) fdEl.textContent = f.d;
      if (insEl)
        insEl.innerHTML = f.i
          .map(
            (x) =>
              `<label>${x[1]}</label><input id="i${x[0]}" maxlength="${x[3]}" inputmode="numeric" autocomplete="off" placeholder="${x[2]}">`,
          )
          .join('');
      if (outEl) outEl.style.display = 'none';
      editId = null;
    }

    function calc() {
      const v: string[] = [];
      for (const x of F[cur].i) {
        const e = $('i' + x[0]) as HTMLInputElement | null;
        if (!e) continue;
        const s = nd(e.value);
        if (x[1].includes('ঐচ্ছিক') && !s) {
          v.push('');
          continue;
        }
        if (!/^\d+$/.test(s) || s.length !== x[3]) {
          alert(x[1] + ' সঠিক ডিজিট দিন');
          e.focus();
          return;
        }
        e.value = s;
        v.push(s);
      }
      const o = F[cur].c(v);
      const h = safeJSON('H_' + cur, []);
      const outEl = $('out');
      if (outEl) {
        outEl.style.display = 'block';
        outEl.innerHTML =
          o.s + `<div class="final"><small>FINAL RESULT</small><b>${esc(o.r)}</b></div>`;
      }
      if (editId) {
        const n = h.find((x: any) => String(x.id) === String(editId));
        if (n) {
          n.v = v;
          n.n = v.filter(Boolean).join(' + ');
          n.r = o.r;
          n.wrong = false;
        }
        editId = null;
      } else {
        h.unshift({
          id: Date.now() + Math.random(),
          v,
          n: v.filter(Boolean).join(' + '),
          r: o.r,
          wrong: false,
          at: new Date().toISOString(),
        });
      }
      localStorage.setItem('H_' + cur, JSON.stringify(h.slice(0, 300)));
      showH(cur);
      summary();
      toast('History-তে সেভ হয়েছে');
    }

    function allH() {
      const o: any[] = [];
      Object.keys(F).forEach((f) =>
        safeJSON('H_' + f, []).forEach((x: any) => o.push({ ...x, f })),
      );
      return o.sort(
        (a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime(),
      );
    }

    function showH(f: string) {
      const hsEl = $('hs') as HTMLSelectElement | null;
      const htEl = $('ht');
      const hlEl = $('hl');
      if (hsEl) hsEl.value = f;
      if (htEl) htEl.textContent = f + ' History';
      const h = safeJSON('H_' + f, []);
      if (hlEl) {
        hlEl.innerHTML = h.length
          ? h
              .map(
                (x: any) =>
                  `<div class="hist${x.wrong ? ' wrong' : ''}"><span class="hn">${esc(x.n)}</span><span class="res">${esc(x.r)}</span><div class="hist-actions"><button class="ha-edit" onclick="window.editH('${f}','${x.id}')">✏️</button><button class="ha-wrong" onclick="window.wrongH('${f}','${x.id}')">❌</button><button class="ha-del" onclick="window.delH('${f}','${x.id}')">🗑</button></div></div>`,
              )
              .join('')
          : '<div class="empty">কোনো History নেই</div>';
      }
    }

    function editH(f: string, id: any) {
      const fsEl = $('fs') as HTMLSelectElement | null;
      if (fsEl) fsEl.value = f;
      loadF();
      const n = safeJSON('H_' + f, []).find((x: any) => String(x.id) === String(id));
      if (!n) return;
      F[f].i.forEach((x, i) => {
        const e = $('i' + x[0]) as HTMLInputElement | null;
        if (e) e.value = n.v[i] || '';
      });
      editId = n.id;
      openPage('calc');
    }

    function wrongH(f: string, id: any) {
      const h = safeJSON('H_' + f, []);
      const n = h.find((x: any) => String(x.id) === String(id));
      if (n) {
        n.wrong = !n.wrong;
        localStorage.setItem('H_' + f, JSON.stringify(h));
        showH(f);
        summary();
      }
    }

    function delH(f: string, id: any) {
      if (!confirm('এই History মুছে ফেলবেন?')) return;
      localStorage.setItem(
        'H_' + f,
        JSON.stringify(safeJSON('H_' + f, []).filter((x: any) => String(x.id) !== String(id))),
      );
      showH(f);
      summary();
    }

    function summary() {
      const h = allH();
      const c: Record<string, number> = {};
      h.forEach((x) => (c[x.f] = (c[x.f] || 0) + 1));
      const rc: Record<string, number> = {};
      h.forEach((x) => (rc[x.r] = (rc[x.r] || 0) + 1));
      const top = Object.entries(rc)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const statsEl = $('stats');
      const localSummaryEl = $('localSummary');
      const dashHistoryEl = $('dashHistory');

      if (statsEl) {
        statsEl.innerHTML = `<div class="stat"><b>${h.length}</b><small>মোট History</small></div><div class="stat"><b>${h.filter((x) => x.wrong).length}</b><small>Wrong</small></div><div class="stat"><b>${new Set(h.map((x) => x.f)).size}</b><small>Formula Used</small></div>`;
      }
      if (localSummaryEl) {
        localSummaryEl.textContent = `মোট History: ${h.length}
F1=${c.F1 || 0} • F2=${c.F2 || 0} • F3=${c.F3 || 0} • F4=${c.F4 || 0} • F5=${c.F5 || 0}
F6=${c.F6 || 0} • F7=${c.F7 || 0} • F8=${c.F8 || 0} • F9=${c.F9 || 0} • F10=${c.F10 || 0}
Wrong: ${h.filter((x) => x.wrong).length}
${top.length ? 'বেশি দেখা Result: ' + top.map((x) => x[0] + ' (' + x[1] + ')').join(', ') : 'এখনও Result নেই'}`;
      }
      if (dashHistoryEl) {
        dashHistoryEl.innerHTML =
          h
            .slice(0, 10)
            .map(
              (x) =>
                `<div class="game-item"><div><b>${esc(x.f)} → ${esc(x.r)}</b><div class="game-meta">${esc(x.n)}</div></div></div>`,
            )
            .join('') || '<div class="empty">এখনও কোনো Formula History নেই।</div>';
      }
    }

    function payload() {
      return allH().map((x, i) => ({
        no: i + 1,
        formula: x.f,
        input: x.n,
        result: x.r,
        status: x.wrong ? 'wrong' : 'normal',
        date: (x.at || '').slice(0, 10),
      }));
    }

    function getProxy() {
      return ai().proxyUrl.trim().replace(/\/+$/, '');
    }

    function extract(d: any) {
      return (
        (d?.content || [])
          .map((x: any) => x?.text || '')
          .join('\n')
          .trim() ||
        d?.choices?.[0]?.message?.content ||
        d?.choices?.[0]?.text ||
        d?.output_text ||
        d?.response ||
        ''
      );
    }

    async function callProxy(messages: any[]) {
      const s = ai();
      const url = getProxy();
      if (!url) throw Error('Cloudflare Worker URL দিন।');
      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: s.model,
            max_tokens: Math.min(Math.max(Number(s.maxTokens) || 1200, 1), 4096),
            messages,
          }),
        });
      } catch (e) {
        throw Error(
          'Failed to fetch — Worker URL/CORS সমস্যা। Settings এ Worker URL পরীক্ষা করুন।',
        );
      }
      const raw = await response.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw Error('Worker JSON দেয়নি. HTTP ' + response.status + ' — ' + raw.slice(0, 500));
      }
      if (!response.ok)
        throw Error(
          'HTTP ' +
            response.status +
            ' — ' +
            (data?.error?.message || data?.error || data?.message || JSON.stringify(data)),
        );
      const text = extract(data);
      if (!text) throw Error('API সফল হয়েছে, কিন্তু text response পাওয়া যায়নি।');
      return text;
    }

    function aiPrompt() {
      return `তুমি Game Of Master Formula History assistant। খুব ছোট বাংলা summary দাও। শুধু supplied history নিয়ে কথা বলবে; ভবিষ্যৎ result, winning number, guarantee বা betting recommendation দেবে না। মোট History, F1-F10 ব্যবহার, Wrong count এবং উল্লেখযোগ্য repetition/pattern থাকলে ১ লাইনে বলো। DATA: ${JSON.stringify(payload())}`;
    }

    async function aiAnalyze() {
      const h = payload();
      const aiErrorEl = $('aiError');
      const aiAnalyzeBtn = $('aiAnalyze') as HTMLButtonElement | null;
      const aiStatusEl = $('aiStatus');
      const aiSummaryEl = $('aiSummary');

      if (!h.length) {
        if (aiErrorEl)
          aiErrorEl.innerHTML = '<div class="warn">আগে Formula হিসাব করে History তৈরি করুন।</div>';
        return;
      }
      if (aiAnalyzeBtn) aiAnalyzeBtn.disabled = true;
      if (aiStatusEl) aiStatusEl.textContent = 'Analyzing…';
      try {
        const t = await callProxy([{ role: 'user', content: aiPrompt() }]);
        if (aiSummaryEl) {
          aiSummaryEl.textContent = t;
          aiSummaryEl.style.display = 'block';
        }
        if (aiStatusEl) aiStatusEl.textContent = 'Done';
        chat = [
          {
            role: 'system',
            content:
              'তুমি Game Of Master Formula History assistant। খুব ছোট বাংলায় উত্তর দাও। ভবিষ্যৎ result বা betting recommendation দিও না। History: ' +
              JSON.stringify(h),
          },
          { role: 'assistant', content: t },
        ];
      } catch (e: any) {
        if (aiStatusEl) aiStatusEl.textContent = 'Failed';
        if (aiErrorEl) aiErrorEl.innerHTML = '<div class="warn">❌ ' + esc(e.message) + '</div>';
      } finally {
        if (aiAnalyzeBtn) aiAnalyzeBtn.disabled = false;
      }
    }

    function chatMsg(role: string, t: string) {
      const chatBox = $('chatBox');
      if (!chatBox) return;
      const d = document.createElement('div');
      d.className = 'chat-msg ' + (role === 'user' ? 'chat-user' : 'chat-ai');
      d.textContent = t;
      chatBox.appendChild(d);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendChat() {
      const i = $('chatInput') as HTMLInputElement | null;
      if (!i) return;
      const t = i.value.trim();
      if (!t) return;
      i.value = '';
      chatMsg('user', t);
      if (!chat.length) {
        chat = [
          {
            role: 'system',
            content:
              'তুমি Game Of Master Formula History assistant। খুব ছোট বাংলায় উত্তর দাও। ভবিষ্যৎ result বা betting recommendation দিও না। History: ' +
              JSON.stringify(payload()),
          },
        ];
      }
      chat.push({ role: 'user', content: t });
      const chatSendBtn = $('chatSend') as HTMLButtonElement | null;
      if (chatSendBtn) chatSendBtn.disabled = true;
      try {
        const r = await callProxy(chat);
        chat.push({ role: 'assistant', content: r });
        chatMsg('ai', r);
      } catch (e: any) {
        chatMsg('ai', '❌ ' + e.message);
      } finally {
        if (chatSendBtn) chatSendBtn.disabled = false;
      }
    }

    function loadAI() {
      const s = ai();
      const proxyUrlEl = $('proxyUrl') as HTMLInputElement | null;
      const modelEl = $('model') as HTMLSelectElement | null;
      const maxTokensEl = $('maxTokens') as HTMLInputElement | null;
      if (proxyUrlEl) proxyUrlEl.value = s.proxyUrl;
      if (modelEl) modelEl.value = s.model;
      if (maxTokensEl) maxTokensEl.value = s.maxTokens;
    }

    function downloadHistory() {
      const hsEl = $('hs') as HTMLSelectElement | null;
      const f = hsEl?.value || 'F1';
      const h = safeJSON('H_' + f, []);
      if (!h.length) {
        toast('এই Formula-তে History নেই');
        return;
      }
      const rows = [
        ['Formula', 'Input', 'Result', 'Status', 'Date'],
        ...h.map((x: any) => [
          f,
          x.n,
          x.r,
          x.wrong ? 'Wrong' : 'Normal',
          (x.at || '').slice(0, 19).replace('T', ' '),
        ]),
      ];
      const csv =
        '\uFEFF' +
        rows
          .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
          .join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Game_Of_Master_${f}_History.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast(f + ' History downloaded');
    }

    function games() {
      return safeJSON('GAMES', []);
    }

    function renderGames() {
      const a = games();
      const gCountEl = $('gCount');
      const gameListEl = $('gameList');
      if (gCountEl) gCountEl.textContent = String(a.length);
      if (gameListEl) {
        gameListEl.innerHTML =
          a
            .map(
              (g: any) =>
                `<div class="game-item"><div style="flex:1"><b>${g.open || '—'} / ${g.jodi || '—'} / ${g.close || '—'}</b><div class="game-meta">${esc(g.market)} • ${esc(g.date)}</div></div><button class="del-btn" onclick="window.delGame(${g.id})">✕</button></div>`,
            )
            .join('') || '<div class="empty">কোনো Game Entry নেই।</div>';
      }
    }

    function delGame(id: any) {
      localStorage.setItem(
        'GAMES',
        JSON.stringify(games().filter((x: any) => x.id !== id)),
      );
      renderGames();
    }

    function notes() {
      const a = safeJSON('NOTES', []);
      const nlEl = $('nl');
      if (nlEl) {
        nlEl.innerHTML =
          a
            .map(
              (x: any) =>
                `<div class="note"><b>${esc(x.t)}</b><p>${esc(x.b)}</p><div class="note-actions"><button class="btn secondary" onclick="window.editNote(${x.id})">✏️ Edit</button><button class="btn danger" onclick="window.delNote(${x.id})">🗑 Delete</button></div></div>`,
            )
            .join('') || '<div class="empty">কোনো Note নেই</div>';
      }
    }

    function editNote(id: any) {
      const n = safeJSON('NOTES', []).find((x: any) => x.id === id);
      if (!n) return;
      const ntEl = $('nt') as HTMLInputElement | null;
      const nbEl = $('nb') as HTMLTextAreaElement | null;
      const noteTitleEl = $('noteTitle');
      const ncancelEl = $('ncancel');
      if (ntEl) ntEl.value = n.t;
      if (nbEl) nbEl.value = n.b;
      noteId = id;
      if (noteTitleEl) noteTitleEl.textContent = '✏️ Edit Note';
      if (ncancelEl) ncancelEl.style.display = 'block';
      openPage('note');
    }

    function delNote(id: any) {
      if (confirm('Note মুছবেন?')) {
        localStorage.setItem(
          'NOTES',
          JSON.stringify(safeJSON('NOTES', []).filter((x: any) => x.id !== id)),
        );
        notes();
      }
    }

    function folders() {
      const a = safeJSON('FOLDERS', []);
      const foldersEl = $('folders');
      if (foldersEl) {
        foldersEl.innerHTML =
          a
            .map(
              (x: any, i: number) =>
                `<div class="folder" onclick="window.openFolder(${i})"><button class="folder-del" onclick="event.stopPropagation();window.delFolder(${i})">🗑</button>📁 <b>${esc(x.n)}</b><small>${x.c || 0} ছবি</small></div>`,
            )
            .join('') || '<div class="empty" style="grid-column:1/-1">কোনো Folder নেই</div>';
      }
    }

    function openFolder(i: number) {
      const a = safeJSON('FOLDERS', []);
      if (!a[i]) return;
      folder = a[i].id;
      const gmEl = $('gm');
      const giEl = $('gi');
      const ftEl = $('ft');
      if (gmEl) gmEl.style.display = 'none';
      if (giEl) giEl.style.display = 'block';
      if (ftEl) ftEl.textContent = '📁 ' + a[i].n;
      renderImgs();
    }

    function delFolder(i: number) {
      const a = safeJSON('FOLDERS', []);
      const x = a[i];
      if (!x || !confirm('Folder ও ছবি মুছবেন?')) return;
      localStorage.removeItem('IMG_' + x.id);
      a.splice(i, 1);
      localStorage.setItem('FOLDERS', JSON.stringify(a));
      folders();
    }

    function renderImgs() {
      const a = safeJSON('IMG_' + folder, []);
      const imgsEl = $('imgs');
      if (imgsEl) {
        imgsEl.innerHTML =
          a
            .map(
              (x: any, i: number) =>
                `<div class="img"><img src="${x}" onclick="window.openLB(${i})"><button class="btn danger" onclick="window.delImg(${i})">মুছুন</button></div>`,
            )
            .join('') ||
          '<div class="empty" style="grid-column:1/-1">এই Folder-এ কোনো ছবি নেই</div>';
      }
    }

    function delImg(i: number) {
      const a = safeJSON('IMG_' + folder, []);
      a.splice(i, 1);
      localStorage.setItem('IMG_' + folder, JSON.stringify(a));
      syncFolder();
      renderImgs();
    }

    function syncFolder() {
      const a = safeJSON('FOLDERS', []);
      const i = a.findIndex((x: any) => x.id === folder);
      if (i >= 0) {
        a[i].c = safeJSON('IMG_' + folder, []).length;
        localStorage.setItem('FOLDERS', JSON.stringify(a));
      }
    }

    let scale = 1;
    function openLB(i: number) {
      const a = safeJSON('IMG_' + folder, []);
      if (!a[i]) return;
      const lbImg = $('lightboxImg') as HTMLImageElement | null;
      const lb = $('lightbox');
      if (lbImg) {
        lbImg.src = a[i];
        scale = 1;
        lbImg.style.transform = 'scale(1)';
      }
      if (lb) lb.classList.add('on');
    }

    function closeLB() {
      const lb = $('lightbox');
      const lbImg = $('lightboxImg') as HTMLImageElement | null;
      if (lb) lb.classList.remove('on');
      if (lbImg) lbImg.src = '';
    }

    function openPage(p: string) {
      document
        .querySelectorAll('.nav button')
        .forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.p === p));
      document
        .querySelectorAll('.section')
        .forEach((s) => s.classList.toggle('on', s.id === p));
      if (p === 'dash') summary();
      if (p === 'calc') {
        const hsEl = $('hs') as HTMLSelectElement | null;
        showH(hsEl?.value || 'F1');
      }
      if (p === 'entry') renderGames();
      if (p === 'note') notes();
      if (p === 'gallery') folders();
      if (p === 'settings') loadAI();
      window.scrollTo(0, 0);
    }

    // Expose helpers globally for onclick attributes in generated markup
    (window as any).editH = editH;
    (window as any).wrongH = wrongH;
    (window as any).delH = delH;
    (window as any).editNote = editNote;
    (window as any).delNote = delNote;
    (window as any).delGame = delGame;
    (window as any).openFolder = openFolder;
    (window as any).delFolder = delFolder;
    (window as any).delImg = delImg;
    (window as any).openLB = openLB;

    // Attach button events
    const navButtons = document.querySelectorAll('.nav button');
    navButtons.forEach((b) => {
      (b as HTMLElement).onclick = () => {
        const p = (b as HTMLElement).dataset.p;
        if (p) openPage(p);
      };
    });

    const fsEl = $('fs');
    if (fsEl) fsEl.onchange = loadF;

    const goBtn = $('go');
    if (goBtn) goBtn.onclick = calc;

    const clrBtn = $('clr');
    if (clrBtn) {
      clrBtn.onclick = () => {
        const insEl = $('ins');
        if (insEl) {
          insEl.querySelectorAll('input').forEach((x) => ((x as HTMLInputElement).value = ''));
        }
        const outEl = $('out');
        if (outEl) outEl.style.display = 'none';
        editId = null;
      };
    }

    const hsEl = $('hs') as HTMLSelectElement | null;
    if (hsEl) hsEl.onchange = () => showH(hsEl.value);

    const aiAnalyzeBtn = $('aiAnalyze');
    if (aiAnalyzeBtn) aiAnalyzeBtn.onclick = aiAnalyze;

    const aiRefreshBtn = $('aiRefresh');
    if (aiRefreshBtn) aiRefreshBtn.onclick = summary;

    const chatSendBtn = $('chatSend');
    if (chatSendBtn) chatSendBtn.onclick = sendChat;

    const chatInput = $('chatInput');
    if (chatInput) {
      chatInput.onkeydown = (e) => {
        if (e.key === 'Enter') sendChat();
      };
    }

    const hcBtn = $('hc');
    if (hcBtn) {
      hcBtn.onclick = () => {
        const hs = $('hs') as HTMLSelectElement | null;
        const f = hs?.value || 'F1';
        if (confirm(f + ' এর সব History মুছে ফেলবেন?')) {
          localStorage.removeItem('H_' + f);
          showH(f);
          summary();
        }
      };
    }

    const saveAIBtn = $('saveAI');
    if (saveAIBtn) {
      saveAIBtn.onclick = () => {
        const proxyUrlEl = $('proxyUrl') as HTMLInputElement | null;
        const modelEl = $('model') as HTMLSelectElement | null;
        const maxTokensEl = $('maxTokens') as HTMLInputElement | null;
        saveAI({
          proxyUrl: (proxyUrlEl?.value || '').trim(),
          model: modelEl?.value || 'claude-opus-5-thinking',
          maxTokens: Math.min(Math.max(Number(maxTokensEl?.value) || 1200, 1), 4096),
        });
        toast('AI settings saved');
      };
    }

    const testAIBtn = $('testAI');
    if (testAIBtn) {
      testAIBtn.onclick = async () => {
        const testResultEl = $('testResult');
        try {
          if (testResultEl) testResultEl.innerHTML = '⏳ Testing…';
          const r = await callProxy([{ role: 'user', content: 'Reply with exactly: PROXY TEST OK' }]);
          if (testResultEl) testResultEl.innerHTML = '<div class="ok">✅ ' + esc(r) + '</div>';
        } catch (e: any) {
          if (testResultEl) testResultEl.innerHTML = '<div class="warn">❌ ' + esc(e.message) + '</div>';
        }
      };
    }

    const downloadHistoryBtn = $('downloadHistory');
    if (downloadHistoryBtn) downloadHistoryBtn.onclick = downloadHistory;

    const gSaveBtn = $('gSave');
    if (gSaveBtn) {
      gSaveBtn.onclick = () => {
        const gMarketEl = $('gMarket') as HTMLInputElement | null;
        const gDateEl = $('gDate') as HTMLInputElement | null;
        const gOpenEl = $('gOpen') as HTMLInputElement | null;
        const gJodiEl = $('gJodi') as HTMLInputElement | null;
        const gCloseEl = $('gClose') as HTMLInputElement | null;

        const m = (gMarketEl?.value || '').trim() || 'General';
        const d = gDateEl?.value || new Date().toISOString().slice(0, 10);
        const o = nd(gOpenEl?.value);
        const j = nd(gJodiEl?.value);
        const c = nd(gCloseEl?.value);

        if (!o && !j && !c) return alert('কমপক্ষে একটি সংখ্যা দিন');
        if (o && !/^\d{3}$/.test(o)) return alert('Open ৩ ডিজিট হতে হবে');
        if (j && !/^\d{2}$/.test(j)) return alert('Jodi ২ ডিজিট হতে হবে');
        if (c && !/^\d{3}$/.test(c)) return alert('Close ৩ ডিজিট হতে হবে');

        const a = games();
        a.unshift({ id: Date.now(), market: m, date: d, open: o, jodi: j, close: c });
        localStorage.setItem('GAMES', JSON.stringify(a));
        if (gOpenEl) gOpenEl.value = '';
        if (gJodiEl) gJodiEl.value = '';
        if (gCloseEl) gCloseEl.value = '';
        renderGames();
        toast('Entry saved');
      };
    }

    const gClearBtn = $('gClear');
    if (gClearBtn) {
      gClearBtn.onclick = () => {
        const gOpenEl = $('gOpen') as HTMLInputElement | null;
        const gJodiEl = $('gJodi') as HTMLInputElement | null;
        const gCloseEl = $('gClose') as HTMLInputElement | null;
        if (gOpenEl) gOpenEl.value = '';
        if (gJodiEl) gJodiEl.value = '';
        if (gCloseEl) gCloseEl.value = '';
      };
    }

    const gClearAllBtn = $('gClearAll');
    if (gClearAllBtn) {
      gClearAllBtn.onclick = () => {
        if (confirm('সব Entry মুছবেন?')) {
          localStorage.removeItem('GAMES');
          renderGames();
        }
      };
    }

    const nsBtn = $('ns');
    if (nsBtn) {
      nsBtn.onclick = () => {
        const ntEl = $('nt') as HTMLInputElement | null;
        const nbEl = $('nb') as HTMLTextAreaElement | null;
        const t = (ntEl?.value || '').trim() || 'Untitled';
        const b = nbEl?.value || '';
        const a = safeJSON('NOTES', []);
        if (noteId) {
          const n = a.find((x: any) => x.id === noteId);
          if (n) {
            n.t = t;
            n.b = b;
          }
        } else {
          a.unshift({ id: Date.now(), t, b });
        }
        localStorage.setItem('NOTES', JSON.stringify(a.slice(0, 300)));
        if (ntEl) ntEl.value = '';
        if (nbEl) nbEl.value = '';
        noteId = null;
        const noteTitleEl = $('noteTitle');
        const ncancelEl = $('ncancel');
        if (noteTitleEl) noteTitleEl.textContent = '📝 Note';
        if (ncancelEl) ncancelEl.style.display = 'none';
        notes();
        toast('Note saved');
      };
    }

    const ncancelBtn = $('ncancel');
    if (ncancelBtn) {
      ncancelBtn.onclick = () => {
        const ntEl = $('nt') as HTMLInputElement | null;
        const nbEl = $('nb') as HTMLTextAreaElement | null;
        if (ntEl) ntEl.value = '';
        if (nbEl) nbEl.value = '';
        noteId = null;
        const noteTitleEl = $('noteTitle');
        if (noteTitleEl) noteTitleEl.textContent = '📝 Note';
        ncancelBtn.style.display = 'none';
      };
    }

    const cfBtn = $('cf');
    if (cfBtn) {
      cfBtn.onclick = () => {
        const fnEl = $('fn') as HTMLInputElement | null;
        const n = (fnEl?.value || '').trim();
        if (!n) return alert('Folder name দিন');
        const a = safeJSON('FOLDERS', []);
        a.push({ id: Date.now(), n, c: 0 });
        localStorage.setItem('FOLDERS', JSON.stringify(a));
        if (fnEl) fnEl.value = '';
        folders();
      };
    }

    const backBtn = $('back');
    if (backBtn) {
      backBtn.onclick = () => {
        const giEl = $('gi');
        const gmEl = $('gm');
        if (giEl) giEl.style.display = 'none';
        if (gmEl) gmEl.style.display = 'block';
        folder = null;
        folders();
      };
    }

    const upInput = $('up') as HTMLInputElement | null;
    if (upInput) {
      upInput.onchange = async (e: any) => {
        const a = safeJSON('IMG_' + folder, []);
        for (const f of e.target.files) {
          const d = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onerror = rej;
            r.onload = () => {
              const im = new Image();
              im.onload = () => {
                const m = 1200;
                let w = im.width;
                let h = im.height;
                if (w > m || h > m) {
                  if (w > h) {
                    h = Math.round((h * m) / w);
                    w = m;
                  } else {
                    w = Math.round((w * m) / h);
                    h = m;
                  }
                }
                const c = document.createElement('canvas');
                c.width = w;
                c.height = h;
                const ctx = c.getContext('2d');
                if (ctx) ctx.drawImage(im, 0, 0, w, h);
                res(c.toDataURL('image/jpeg', 0.75));
              };
              im.onerror = rej;
              im.src = r.result as string;
            };
            r.readAsDataURL(f);
          });
          a.unshift(d);
        }
        try {
          localStorage.setItem('IMG_' + folder, JSON.stringify(a));
          syncFolder();
          renderImgs();
        } catch (err) {
          alert('Storage পূর্ণ। কিছু ছবি মুছে দিন।');
        }
        e.target.value = '';
      };
    }

    const lbClose = $('lbClose');
    if (lbClose) lbClose.onclick = closeLB;

    const lb = $('lightbox');
    if (lb) {
      lb.onclick = (e) => {
        if ((e.target as HTMLElement).id === 'lightbox') closeLB();
      };
    }

    const lbIn = $('lbIn');
    if (lbIn) {
      lbIn.onclick = () => {
        const lbImg = $('lightboxImg');
        if (lbImg) {
          scale = Math.min(6, scale + 0.5);
          lbImg.style.transform = `scale(${scale})`;
        }
      };
    }

    const lbOut = $('lbOut');
    if (lbOut) {
      lbOut.onclick = () => {
        const lbImg = $('lightboxImg');
        if (lbImg) {
          scale = Math.max(1, scale - 0.5);
          lbImg.style.transform = `scale(${scale})`;
        }
      };
    }

    const lbReset = $('lbReset');
    if (lbReset) {
      lbReset.onclick = () => {
        const lbImg = $('lightboxImg');
        if (lbImg) {
          scale = 1;
          lbImg.style.transform = 'scale(1)';
        }
      };
    }

    // Initial setup
    if (!localStorage.getItem('AI_CONFIG')) saveAI(DEFAULT_AI);
    initF();
    loadAI();
    summary();
    showH('F1');
    notes();
    folders();
    renderGames();
    const gDateEl = $('gDate') as HTMLInputElement | null;
    if (gDateEl) gDateEl.valueAsDate = new Date();
  }, []);

  return (
    <div className="app">
      <header className="top">
        <h1>🎮 Game Of Master</h1>
        <p>F1–F10 Formula • History • AI Summary • Chat • Entry • Note • Gallery</p>
      </header>
      <nav className="nav">
        <button className="on" data-p="dash">
          📊 Dashboard
        </button>
        <button data-p="calc">🧮 Formula</button>
        <button data-p="entry">✍️ Entry</button>
        <button data-p="note">📝 Note</button>
        <button data-p="gallery">🖼 Gallery</button>
        <button data-p="settings">⚙️ AI</button>
      </nav>
      <main className="page">
        <section id="dash" className="section on">
          <div className="card">
            <div className="title">📊 History Dashboard</div>
            <div className="muted">
              F1–F10 History-এর ছোট summary। ভবিষ্যৎ ফল অনুমান করা হয় না।
            </div>
            <div className="grid3" id="stats"></div>
          </div>
          <div className="card">
            <div className="ai-head">
              <div className="title" style={{ fontSize: '16px' }}>
                🤖 AI Summary & Chat
              </div>
              <span id="aiStatus" className="ai-status">
                Ready
              </span>
            </div>
            <div className="muted">History AI-কে পাঠিয়ে ছোট summary নিন।</div>
            <div className="grid2">
              <button className="btn primary" id="aiAnalyze">
                ✨ AI Summary
              </button>
              <button className="btn secondary" id="aiRefresh">
                ↻ Local Summary
              </button>
            </div>
            <div id="localSummary" className="ai-box" style={{ marginTop: '9px' }}></div>
            <div
              id="aiSummary"
              className="ai-box"
              style={{ marginTop: '9px', display: 'none' }}
            ></div>
            <div id="aiError" style={{ marginTop: '9px' }}></div>
            <div
              style={{
                marginTop: '14px',
                borderTop: '1px solid #e5eaf1',
                paddingTop: '12px',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>
                💬 ছোট মেসেজে AI-কে জিজ্ঞেস করুন
              </div>
              <div
                id="chatBox"
                style={{
                  maxHeight: '240px',
                  overflowY: 'auto',
                  background: '#f8fafc',
                  border: '1px solid #e5eaf1',
                  borderRadius: '10px',
                  padding: '10px',
                  marginBottom: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ color: '#64748b', textAlign: 'center', fontSize: '11px' }}>
                  যেকোনো ছোট প্রশ্ন লিখুন।
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input id="chatInput" placeholder="যেমন: F7 কতবার হয়েছে?" />
                <button
                  className="btn primary"
                  id="chatSend"
                  style={{ width: 'auto', whiteSpace: 'nowrap' }}
                >
                  পাঠান
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="title" style={{ fontSize: '16px' }}>
              🕘 Recent History
            </div>
            <div id="dashHistory"></div>
          </div>
        </section>

        <section id="calc" className="section">
          <div className="card">
            <div className="title">🧮 Formula নির্বাচন</div>
            <div className="muted">
              F1–F10 নির্বাচন করুন। বাংলা/ইংরেজি ডিজিট দুটোই কাজ করবে।
            </div>
            <select id="fs" style={{ marginTop: '8px' }}></select>
            <div id="fd" className="muted" style={{ marginTop: '5px' }}></div>
            <div id="ins"></div>
            <div className="grid2">
              <button className="btn primary" id="go">
                🧮 হিসাব করুন
              </button>
              <button className="btn secondary" id="clr">
                Clear
              </button>
            </div>
            <div id="out" className="result"></div>
          </div>
          <div className="card">
            <div className="title" style={{ fontSize: '16px' }}>
              F1–F10 Formula Summary
            </div>
            <div id="fl"></div>
          </div>
          <div className="card">
            <div className="title" style={{ fontSize: '16px' }}>
              🕘 Formula History
            </div>
            <select id="hs"></select>
            <div className="grid2">
              <b id="ht" style={{ padding: '10px 0' }}></b>
              <button className="btn green" id="downloadHistory">
                ⬇️ History Download
              </button>
            </div>
            <div className="grid2">
              <div className="muted" style={{ padding: '4px 0' }}>
                ✏️ Edit • ❌ Wrong • 🗑 Delete
              </div>
              <button className="btn danger" id="hc">
                Clear All
              </button>
            </div>
            <div id="hl" className="history"></div>
          </div>
        </section>

        <section id="entry" className="section">
          <div className="card">
            <div className="title">✍️ Game Entry</div>
            <div className="muted">Open / Jodi / Close সংরক্ষণ করুন।</div>
            <label>বাজারের নাম</label>
            <input id="gMarket" placeholder="যেমন: Kalyan, Milan" />
            <label>তারিখ</label>
            <input id="gDate" type="date" />
            <div className="entry-row">
              <div>
                <label>Open</label>
                <input id="gOpen" maxLength={3} inputMode="numeric" placeholder="157" />
              </div>
              <div>
                <label>Jodi</label>
                <input id="gJodi" maxLength={2} inputMode="numeric" placeholder="72" />
              </div>
              <div>
                <label>Close</label>
                <input id="gClose" maxLength={3} inputMode="numeric" placeholder="590" />
              </div>
            </div>
            <div className="grid2">
              <button className="btn primary" id="gSave">
                💾 Save
              </button>
              <button className="btn secondary" id="gClear">
                Clear
              </button>
            </div>
          </div>
          <div className="card">
            <div className="title" style={{ fontSize: '16px' }}>
              📋 Game Entries (<span id="gCount">0</span>)
            </div>
            <div id="gameList" className="history"></div>
            <button className="btn danger" id="gClearAll" style={{ marginTop: '9px' }}>
              🗑 সব Entry মুছুন
            </button>
          </div>
        </section>

        <section id="note" className="section">
          <div className="card">
            <div className="title" id="noteTitle">
              📝 Note
            </div>
            <label>নোটের নাম</label>
            <input id="nt" placeholder="যেমন: F7 Note" />
            <label>নোট</label>
            <textarea id="nb" placeholder="এখানে লিখুন..."></textarea>
            <div className="grid2">
              <button className="btn primary" id="ns">
                💾 Save
              </button>
              <button className="btn secondary" id="ncancel" style={{ display: 'none' }}>
                Cancel
              </button>
            </div>
          </div>
          <div className="card">
            <div className="title" style={{ fontSize: '16px' }}>
              Saved Notes
            </div>
            <div id="nl"></div>
          </div>
        </section>

        <section id="gallery" className="section">
          <div className="card" id="gm">
            <div className="title">🖼 Screenshot Gallery</div>
            <div className="muted">Folder বানিয়ে ছবি local device-এ রাখুন।</div>
            <div className="grid2">
              <input id="fn" placeholder="Folder name" />
              <button className="btn primary" id="cf">
                + Folder
              </button>
            </div>
            <div id="folders" className="folders"></div>
          </div>
          <div className="card" id="gi" style={{ display: 'none' }}>
            <button className="btn secondary" id="back">
              ← Back
            </button>
            <h3 id="ft"></h3>
            <label
              className="btn green"
              style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}
            >
              + Screenshot
              <input id="up" type="file" accept="image/*" multiple style={{ display: 'none' }} />
            </label>
            <div id="imgs" className="images"></div>
          </div>
        </section>

        <section id="settings" className="section">
          <div className="card">
            <div className="title">⚙️ AI Connection</div>
            <div className="muted">
              আপনার Worker connection-এর fetch পদ্ধতি রাখা হয়েছে।
            </div>
            <label>Cloudflare Worker URL</label>
            <input
              id="proxyUrl"
              placeholder="https://your-worker.workers.dev"
              defaultValue="https://gorouter-proxy.mubarak948476382.workers.dev"
            />
            <label>Model</label>
            <select id="model" defaultValue="claude-opus-5-thinking">
              <option value="claude-opus-5-thinking">claude-opus-5-thinking</option>
              <option value="claude-opus-5">claude-opus-5</option>
              <option value="claude-opus-4-8">claude-opus-4-8</option>
              <option value="claude-opus-4-8-thinking">claude-opus-4-8-thinking</option>
            </select>
            <label>Max tokens</label>
            <input id="maxTokens" type="number" min="1" max="4096" defaultValue={1200} />
            <div className="grid2">
              <button className="btn primary" id="saveAI">
                💾 Save
              </button>
              <button className="btn green" id="testAI">
                🔎 Test Proxy
              </button>
            </div>
            <div id="testResult" style={{ marginTop: '9px' }}></div>
          </div>
        </section>

        <div
          style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '10px',
            padding: '15px',
          }}
        >
          Game Of Master • Single HTML • Local Storage • F1–F10 • AI
        </div>
      </main>

      <div id="lightbox">
        <button className="lbclose" id="lbClose">
          ✕
        </button>
        <img id="lightboxImg" src="" alt="preview" />
        <div className="lbctrl">
          <button id="lbOut">−</button>
          <button id="lbReset">⟳</button>
          <button id="lbIn">+</button>
        </div>
      </div>
      <div id="toast"></div>
    </div>
  );
}
