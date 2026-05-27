/*
 * JS da Base de Conhecimento
 * - Busca em tempo real + filtros (inclui categoria 'videos')
 * - Render de artigos salvos em localStorage (vt_kb_articles)
 * - Modal de visualização ao clicar no card/btn
*/

document.addEventListener('DOMContentLoaded', () => {
  const searchInput    = document.getElementById('searchInput');
  const filterButtons  = document.querySelectorAll('.filter-btn');
  const articlesGrid   = document.getElementById('articlesGrid');

  // Carrega do DOM e + do localStorage
  function loadArticlesFromDOM() {
    return Array.from(articlesGrid.querySelectorAll('.article-card')).map(card => ({
      el: card,
      category: (card.dataset.category || 'outros').toLowerCase(),
      title: card.dataset.title || card.querySelector('h3')?.textContent?.trim() || '',
      link: (card.dataset.link || '').trim(),
      text: (card.querySelector('p')?.textContent || '').toLowerCase()
    }));
  }

  function createCardEl(item) {
    const wrap = document.createElement('div');
    wrap.className = 'article-card';
    wrap.dataset.category = item.category;
    wrap.dataset.title = item.title;
    wrap.dataset.link = item.link || '';

    const catClass = {
      sistema: 'category--sistema',
      fiscal: 'category--fiscal',
      hardware: 'category--hardware',
      videos: 'category--videos'
    }[item.category] || 'category--sistema';

    wrap.innerHTML = `
      <span class="category-tag ${catClass}">${labelForCategory(item.category)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${stripHtml(item.content).slice(0, 160)}${item.content.length > 160 ? '…' : ''}</p>
      <button class="btn btn-secondary article-open">
        <i class="ph ${item.category === 'videos' ? 'ph-play-circle' : 'ph-book-open'}"></i>
        ${item.category === 'videos' ? 'Assistir' : 'Ler'}
      </button>
      <div class="article-full" hidden>${item.content}</div>
    `;
    return wrap;
  }

  function labelForCategory(cat) {
    switch ((cat || '').toLowerCase()) {
      case 'sistema':  return 'Sistema';
      case 'fiscal':   return 'Fiscal';
      case 'hardware': return 'Hardware';
      case 'videos':   return 'Vídeos';
      default:         return 'Outros';
    }
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '');
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[s]));
  }

  function loadArticlesFromStorage() {
    try {
      const raw = localStorage.getItem('vt_kb_articles');
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr;
    } catch {
      return [];
    }
  }

  // Renderiza artigos salvos no topo do grid
  function renderStoredArticles() {
    const stored = loadArticlesFromStorage();
    if (!stored.length) return;

    // insere novos cards no início
    const frag = document.createDocumentFragment();
    stored.forEach(item => {
      const card = createCardEl(item);
      frag.appendChild(card);
    });
    articlesGrid.prepend(frag);
  }

  renderStoredArticles();

  // Atualiza a lista de referência após possível prepend
  let allArticles = loadArticlesFromDOM();

  // --- Filtro principal
  function filterArticles() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeCategory = activeBtn ? (activeBtn.dataset.category || 'todos') : 'todos';
    const term = (searchInput.value || '').toLowerCase().trim();

    allArticles.forEach(({ el, category, title, text }) => {
      const catOk = (activeCategory === 'todos') || (category === activeCategory);
      const haystack = (title.toLowerCase() + ' ' + text);
      const termOk = term.length ? haystack.includes(term) : true;
      el.style.display = (catOk && termOk) ? 'flex' : 'none';
    });
  }

  searchInput.addEventListener('input', filterArticles);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      filterArticles();
    });
  });

  // --- Modal de leitura
  const modalOverlay   = document.getElementById('articleModal');
  const modalTitleEl   = document.getElementById('articleModalTitle');
  const modalCatEl     = document.getElementById('articleModalCategory');
  const modalContentEl = document.getElementById('articleModalContent');
  const modalLinkEl    = document.getElementById('articleModalLink');
  const closeX         = document.getElementById('articleModalCloseX');
  const closeBtn       = document.getElementById('articleModalCloseBtn');

  function openModalForCard(card) {
    const title = card.dataset.title || card.querySelector('h3')?.textContent?.trim() || '';
    const category = (card.dataset.category || 'outros').toLowerCase();
    const fullContentEl = card.querySelector('.article-full');
    const contentHtml = fullContentEl ? fullContentEl.innerHTML : (card.querySelector('p')?.innerHTML || '');
    const link = (card.dataset.link || '').trim();

    modalTitleEl.textContent = title;

    // categoria tag
    modalCatEl.className = 'category-tag ' + ({
      sistema: 'category--sistema',
      fiscal: 'category--fiscal',
      hardware: 'category--hardware',
      videos: 'category--videos'
    }[category] || 'category--sistema');
    modalCatEl.textContent = labelForCategory(category);

    modalContentEl.innerHTML = contentHtml || '<p>Sem conteúdo detalhado.</p>';

    if (link) {
      modalLinkEl.style.display = 'inline-flex';
      modalLinkEl.href = link;
    } else {
      modalLinkEl.style.display = 'none';
      modalLinkEl.removeAttribute('href');
    }

    modalOverlay.classList.add('visible');
  }

  function closeModal() {
    modalOverlay.classList.remove('visible');
  }

  articlesGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.article-open');
    const card = btn ? btn.closest('.article-card') : e.target.closest('.article-card');
    if (!card) return;
    // Abre modal somente se clicou no card/btn
    if (btn || e.target.closest('.article-card')) {
      openModalForCard(card);
    }
  });

  closeX.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
});
