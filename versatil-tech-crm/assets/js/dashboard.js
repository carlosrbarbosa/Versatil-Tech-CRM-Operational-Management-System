// KPIs com contagem animada. Se houver cache de tickets, usa real;
// se não houver, usa valores de exemplo para você visualizar.
document.addEventListener('DOMContentLoaded', () => {
  const openEl = document.getElementById('metricOpen');
  const progEl = document.getElementById('metricProgress');
  const doneEl = document.getElementById('metricDone');

  const cached = readJSON('versatilTicketsCache', null);
  let targets = { open: 8, progress: 5, done: 23 }; // números de exemplo

  if (Array.isArray(cached) && cached.length) {
    targets = countFromTickets(cached);
  }

  animateCount(openEl, targets.open, 1100);
  animateCount(progEl, targets.progress, 1200);
  animateCount(doneEl, targets.done, 1300);

  // --- helpers ---
  function readJSON(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  }

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '')
      .trim();
  }

  function countFromTickets(list) {
    const out = { open: 0, progress: 0, done: 0 };
    for (const t of list) {
      const s = normalize(t.status);
      if (['aberto','novo','pendente'].includes(s) || s.startsWith('aguard')) { out.open++; continue; }
      if (['emandamento','andamento','investigando','emprogresso'].includes(s)) { out.progress++; continue; }
      if (['concluido','concluído','resolvido','fechado','encerrado'].includes(s)) { out.done++; continue; }
    }
    return out;
  }

  function animateCount(el, to, duration = 1200) {
    const start = 0;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = Math.round(start + (to - start) * eased);
      el.textContent = val.toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
});
