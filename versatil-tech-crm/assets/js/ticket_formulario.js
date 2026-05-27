/* =========================================================
   TICKET_FORMULÁRIO.JS
   - Busca de cliente (mock)
   - Notas com imagens (múltiplas), preview, remover e excluir
   - Salvar (simulação) + persistência local das notas por ticket
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ====== elementos base
  const form          = document.getElementById('ticketForm');
  const numberInput   = document.getElementById('numeroTicket');
  const clienteInput  = document.getElementById('clienteSearchInput');
  const clienteId     = document.getElementById('clienteIdInput');
  const resultsBox    = document.getElementById('searchResults');

  const statusSelect  = document.getElementById('statusTicket');
  const prioSelect    = document.getElementById('prioridadeTicket');
  const linkSGA       = document.getElementById('linkSGA');

  // notas
  const noteText      = document.getElementById('noteText');
  const noteImages    = document.getElementById('noteImages');
  const notePreviews  = document.getElementById('notePreviews');
  const addNoteBtn    = document.getElementById('addNoteBtn');
  const notesList     = document.getElementById('notesList');
  const saveBtn       = document.getElementById('saveTicketBtn');

  // ====== helpers
  const ticketKey = () => {
    const id = (numberInput.value || 'novo').trim();
    return `vt_ticket_notes_${id}`;
  };

  function loadNotes() {
    try {
      const raw = localStorage.getItem(ticketKey());
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveNotes(list) {
    localStorage.setItem(ticketKey(), JSON.stringify(list));
  }

  function renderNotes() {
    const list = loadNotes();
    if (!list.length) {
      notesList.classList.add('empty');
      notesList.innerHTML = '<p class="empty-message">Nenhuma nota adicionada ainda.</p>';
      return;
    }

    notesList.classList.remove('empty');
    notesList.innerHTML = list.map((n, idx) => {
      const imgs = (n.images || []).map(src => `<img src="${src}" alt="anexo" />`).join('');
      return `
        <div class="note-item" data-index="${idx}">
          <div class="note-header">
            <strong>${n.author || '[Você]'}</strong>
            <span class="dot"></span>
            <span title="${n.datetime}">${n.datetime}</span>
          </div>
          <div class="note-body">${escapeHtml(n.text)}</div>
          ${imgs ? `<div class="note-attachments">${imgs}</div>` : ''}
          <div class="note-actions">
            <button type="button" class="btn btn-secondary btn-small" data-action="delete"><i class="ph ph-trash"></i> Excluir</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str = '') {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  // ====== busca de cliente (mock local)
  const MOCK_CLIENTES = [
    { id: '1987', nome: 'Auto Posto Master' },
    { id: '1988', nome: 'Posto Ipiranga Centro' },
    { id: '1989', nome: 'Posto Shell Via Dutra' },
    { id: '1990', nome: 'Rede Esperança' },
    { id: '1991', nome: 'Posto Via Norte' },
    { id: '1992', nome: 'Auto Posto Nova Era' }
  ];

  clienteInput.addEventListener('input', () => {
    const term = clienteInput.value.trim().toLowerCase();
    const matches = !term
      ? []
      : MOCK_CLIENTES.filter(c => (c.nome+' '+c.id).toLowerCase().includes(term)).slice(0, 10);

    if (!matches.length) {
      resultsBox.classList.remove('visible');
      resultsBox.innerHTML = '';
      return;
    }

    resultsBox.innerHTML = matches
      .map(c => `<div class="search-result-item" data-id="${c.id}" data-nome="${c.nome}">${c.nome} <small style="color:var(--cor-texto-secundario)">#${c.id}</small></div>`)
      .join('');
    resultsBox.classList.add('visible');
  });

  resultsBox.addEventListener('click', (ev) => {
    const item = ev.target.closest('.search-result-item');
    if (!item) return;
    clienteInput.value = item.dataset.nome;
    clienteId.value = item.dataset.id;
    resultsBox.classList.remove('visible');
    resultsBox.innerHTML = '';
  });

  document.addEventListener('click', (ev) => {
    if (!resultsBox.contains(ev.target) && ev.target !== clienteInput) {
      resultsBox.classList.remove('visible');
    }
  });

  // ====== previews de imagem da nova nota
  let selectedFiles = []; // [{name, dataUrl}]

  noteImages.addEventListener('change', async () => {
    selectedFiles = [];
    notePreviews.innerHTML = '';
    const files = Array.from(noteImages.files || []).slice(0, 12); // limita por segurança

    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      const dataUrl = await fileToDataURL(f);
      selectedFiles.push({ name: f.name, dataUrl });
      appendPreview(dataUrl);
    }
  });

  function appendPreview(src) {
    const wrapper = document.createElement('div');
    wrapper.className = 'note-preview';
    wrapper.innerHTML = `
      <img src="${src}" alt="preview"/>
      <button type="button" title="Remover">&times;</button>
    `;
    wrapper.querySelector('button').addEventListener('click', () => {
      // remove da lista selecionada
      selectedFiles = selectedFiles.filter(s => s.dataUrl !== src);
      wrapper.remove();
    });
    notePreviews.appendChild(wrapper);
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  // ====== adicionar nota
  addNoteBtn.addEventListener('click', () => {
    const text = (noteText.value || '').trim();
    if (!text && !selectedFiles.length) {
      alert('Escreva algo ou adicione imagens para incluir a nota.');
      return;
    }

    const list = loadNotes();
    list.unshift({
      author: document.getElementById('currentUserName')?.textContent || '[Você]',
      datetime: new Date().toLocaleString(),
      text,
      images: selectedFiles.map(s => s.dataUrl)
    });
    saveNotes(list);

    // limpa campos
    noteText.value = '';
    noteImages.value = '';
    selectedFiles = [];
    notePreviews.innerHTML = '';

    renderNotes();
  });

  // excluir nota
  notesList.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-action="delete"]');
    if (!btn) return;

    const item = ev.target.closest('.note-item');
    const idx = parseInt(item?.dataset?.index ?? '-1', 10);
    if (Number.isNaN(idx) || idx < 0) return;

    if (!confirm('Excluir esta nota?')) return;

    const list = loadNotes();
    list.splice(idx, 1);
    saveNotes(list);
    renderNotes();
  });

  // ====== salvar (simulação)
  saveBtn.addEventListener('click', () => {
    const payload = {
      numero: numberInput.value.trim(),
      cliente_id: clienteId.value.trim(),
      cliente_nome: clienteInput.value.trim(),
      responsavel: document.getElementById('responsavel').value,
      status: statusSelect.value,
      prioridade: prioSelect.value,
      link: linkSGA.value,
      notas: loadNotes()
    };
    console.log('[SIMULAÇÃO SALVAR TICKET]', payload);
    alert('Alterações salvas localmente (simulação).');
  });

  // ao trocar o número, re-carrega as notas desse ticket
  numberInput.addEventListener('change', renderNotes);

  // primeira renderização
  renderNotes();
});
