/* Formulário de Artigo — versão simples (sem TinyMCE)
 * - Campo de URL para vídeo (sem upload)
 * - Conteúdo em <textarea>, com auto-resize e validação simples
 * - Normaliza links do Google Drive para /preview
 * - Persiste em localStorage: chave 'vt_kb_articles'
 */

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('articleForm');
  const titleEl    = document.getElementById('articleTitle');
  const catEl      = document.getElementById('articleCategory');
  const videoUrlEl = document.getElementById('videoUrl');
  const contentEl  = document.getElementById('articleContent');

  // Auto-resize simples do textarea conforme digitação
  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight + 2) + 'px';
  };
  if (contentEl) {
    contentEl.addEventListener('input', () => autoResize(contentEl));
    // ajustar na carga inicial também
    setTimeout(() => autoResize(contentEl), 0);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title   = (titleEl.value || '').trim();
    const category = (catEl.value || 'sistema').toLowerCase();
    const rawUrl  = (videoUrlEl.value || '').trim();
    const content = (contentEl.value || '').trim();

    if (!title) {
      alert('Informe o título do artigo.');
      return;
    }
    if (content.length < 5) {
      const ok = confirm('O conteúdo está muito curto. Deseja publicar mesmo assim?');
      if (!ok) return;
    }

    let videoUrl = '';
    if (rawUrl) {
      if (!isValidUrl(rawUrl)) {
        alert('O link informado não parece um URL válido.');
        return;
      }
      videoUrl = normalizeDriveUrl(rawUrl);
    }

    const newItem = {
      id: Date.now(),
      title,
      category,
      link: videoUrl,      // mantemos a propriedade 'link' para compatibilidade
      content,             // agora é texto puro (não HTML)
      createdAt: new Date().toISOString()
    };

    const list = readArticles();
    list.unshift(newItem);
    writeArticles(list);

    alert('Artigo publicado com sucesso!');
    window.location.href = 'conhecimento.html';
  });

  // ----- Helpers -----
  function readArticles() {
    try {
      const raw = localStorage.getItem('vt_kb_articles');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function writeArticles(list) {
    localStorage.setItem('vt_kb_articles', JSON.stringify(list));
  }

  function isValidUrl(u) {
    try { new URL(u); return true; } catch { return false; }
  }

  // Converte URLs comuns do Drive para /preview (melhor para embed futuramente)
  function normalizeDriveUrl(u) {
    try {
      const url = new URL(u);
      const m1 = url.pathname.match(/\/file\/d\/([^/]+)/); // /file/d/<ID>/
      if (m1 && m1[1]) return `https://drive.google.com/file/d/${m1[1]}/preview`;
      const idParam = url.searchParams.get('id');          // open?id=<ID> / uc?id=<ID>
      if (idParam) return `https://drive.google.com/file/d/${idParam}/preview`;
      return u; // não é Drive ou padrão diferente
    } catch {
      return u;
    }
  }
});
